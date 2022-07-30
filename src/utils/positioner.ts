import { DELTA, MAX_COLUMN_OBJECT } from '~constants';

const savedPointPositions: Record<number, PointPosition[]> = {};
const savedPods: Record<number, Matrix> = {};
const savedNodes: Record<number, Matrix> = {};
const savedDeployments: Record<number, [Matrix, Matrix]> = {};
const savedNamespaces: Record<number, [Matrix, Matrix]> = {};
const savedClusters: Record<number, [Matrix, Matrix]> = {};

const savedViews: Positioner.SavedViews = {
  admin: {},
  developer: {},
};

/**
 * 움직이는 커서의 포지션에 따라 포인트 포지션을 구합니다.
 * @param px {number} mouse position x
 * @param py {number} mouse position y
 * @param level {1 | 2 | 3} view level
 * @param offsetX starting x0 point
 * @param offsetY starting y == 0 point
 * @param hitbox mouse hitbox
 * @returns { PointPosition | null }
 */
const getCursorPosition: Positioner.GetCursorPosition = (
  cx,
  cy,
  level,
  offsetX,
  offsetY,
  hitbox = 15
) => {
  const { DX, DY } = DELTA[level];
  const glitch = parseInt('' + (hitbox >> 1));
  const distX = (cx + glitch - offsetX) % DX;
  const distY = (cy + glitch - offsetY) % DY;

  switch (level) {
    case 1:
      return null;
    case 2:
      return null;
    case 3:
      if (distX > hitbox || distY > hitbox) {
        return null;
      } else {
        const x = cx - distX;
        const y = cy - distY;

        return {
          x,
          y,
          row: parseInt('' + y / (2 * DY)),
          column: parseInt('' + x / DX),
          type: 'point',
        };
      }
  }
};

const getCanvasValues: Positioner.GetCanvasValues = (width, height, level) => {
  const { DX, DY, A } = DELTA[level];
  const numRows = parseInt('' + height / (DY * (level === 3 ? 1 : 2))) + 1;
  const numColumns = parseInt('' + width / DX) + 1;

  return {
    DX,
    DY,
    A,
    numRows,
    numColumns,
    x0: parseInt('' + (width % (DX * 2)) / 2),
    y0: 0,
    row0: -parseInt('' + numRows / 2),
    column0: -parseInt('' + numColumns / 2),
  };
};

/**
 * Grid 레벨에 따른 렌더링 위치를 정의합니다.
 * @param width : 브라우저 내 렌더링된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : Grid View
 * @returns {Position[]}: 렌더링 가능한 모든 포지션
 * @see @types/positioner/index.d.ts
 */
export const getPointPositions: Positioner.GetPointPositions = (
  width,
  height,
  level
) => {
  const ret: PointPosition[] = [];
  const { DX, DY, numRows, numColumns, x0, y0, row0, column0 } =
    getCanvasValues(width, height, level);

  switch (level) {
    case 1:
    case 2:
      Array.from(Array(parseInt('' + numRows) + 1).keys()).map((py, row) => {
        Array.from(Array(numColumns).keys()).map((px, column) => {
          const pos: PointPosition = {
            x: x0 + px * DX,
            y: y0 + py * 2 * DY + (column % 2 ? DY : 0),
            row: row0 + row,
            column: column0 + column,
            type: 'point',
          };

          ret.push(pos);

          let saved = savedPointPositions[py * MAX_COLUMN_OBJECT + px];
          if (!!!saved) {
            saved = [pos];
          } else {
            saved.push(pos);
          }
        });
      });
      break;
    case 3:
      Array.from(Array(numRows).keys()).map((py, row) => {
        Array.from(Array(numColumns).reverse().keys()).map((px, column) => {
          const pos: PointPosition = {
            x: x0 + px * DX,
            y: y0 + py * DY,
            row: row0 + row,
            column: column0 + column,
            type: 'point',
          };

          ret.push(pos);

          let saved = savedPointPositions[py * MAX_COLUMN_OBJECT + px];
          if (!!!saved) {
            saved = [pos];
          } else {
            saved.push(pos);
          }
        });
      });
      break;
  }

  return ret;
};

/**
 * 선택된 항목의 포지션을 반환합니다.
 * @param px : 마우스 커서 x의 위치
 * @param py : 마우스 커서 y의 위치
 * @param level : 현재 Grid 레벨
 * @returns {SelectedPointPosition}
 */
export const getHighlightedPointPosition: Positioner.GetHighlightedPointPosition =
  (width, height, level, cx, cy) => {
    const { DX, DY, x0, y0, row0, column0 } = getCanvasValues(
      width,
      height,
      level
    );
    const hitboxX = 15,
      hitboxY = 15;
    const x = cx + 7,
      y = cy + 7;

    switch (level) {
      case 1:
      case 2:
        if ((x - x0) % DX < hitboxX) {
          const column = column0 + parseInt('' + (x - x0) / DX);
          if (column % 2) {
            if ((y - y0) % (2 * DY) < hitboxY) {
              return {
                x,
                y,
                row: row0 + parseInt('' + (y - y0) / (2 * DY)),
                column: column,
                type: 'point',
              };
            } else return null;
          } else {
            if ((y - DY - y0) % (2 * DY) < hitboxY) {
              return {
                x,
                y,
                row: row0 + parseInt('' + (y - y0) / (2 * DY)),
                column: column,
                type: 'point',
              };
            } else return null;
          }
        } else {
          return null;
        }
      // if ((x - x0) % DX > hitboxX || (y - y0) % (2 * DY) > hitboxY) {
      //   return null;
      // } else {
      //   return {
      //     x,
      //     y,
      //     row: row0 + parseInt('' + (y - y0) / (2 * DY)),
      //     column: column0 + parseInt('' + (x - x0) / DX),
      //     type: 'point',
      //   };
      // }
      case 3:
        if ((x - x0) % DX > hitboxX || (y - y0) % DY > hitboxY) {
          return null;
        } else {
          return {
            x,
            y,
            row: row0 + parseInt('' + (y - y0) / DY),
            column: column0 + parseInt('' + (x - x0) / DX),
            type: 'point',
          };
        }
    }
  };

export const getGridPositions: Positioner.GetLinePositions = (
  width,
  height,
  level
) => {
  const ret: LinePosition[] = [];
  const { DX, DY, A, numRows, numColumns, x0, y0 } = getCanvasValues(
    width,
    height,
    level
  );

  switch (level) {
    case 1:
    case 2:
      Array.from(Array(numRows + numColumns).keys()).map((px) => {
        const x3 = x0 - DX + (px - numRows) * 2 * DX,
          y3 = y0,
          x4 = x0 - DX + px * 2 * DX,
          y4 = y0;

        const pos1: LinePosition = {
          x1: -y3 / A + x3,
          y1: 0,
          x2: (height - y3) / A + x3,
          y2: height,
          type: 'grid',
        };
        const pos2: LinePosition = {
          x1: y4 / A + x4,
          y1: 0,
          x2: -(height - y4) / A + x4,
          y2: height,
          type: 'grid',
        };

        ret.push(pos1);
        ret.push(pos2);
      });
      break;
    case 3:
      Array.from(Array(numColumns).keys()).map((px) => {
        const x3 = x0 - DX / 2 + px * DX;

        const pos: LinePosition = {
          x1: x3,
          y1: 0,
          x2: x3,
          y2: height,
          type: 'grid',
        };

        ret.push(pos);
      });

      Array.from(Array(numRows).keys()).map((py) => {
        const y3 = y0 - DY / 2 + py * DY;

        const pos: LinePosition = {
          x1: 0,
          y1: y3,
          x2: width,
          y2: y3,
          type: 'grid',
        };

        ret.push(pos);
      });
      break;
  }

  return ret;
};

export const getBlockPositions: Positioner.GetBlockPositions = (
  width,
  height,
  level,
  matrixes,
  type
) => {
  const ret: PointPosition[] = [];
  const { DX, DY, A, numRows, numColumns, x0, y0 } = getCanvasValues(
    width,
    height,
    level
  );
  return ret;
};

export const getGroupPositions: Positioner.GetGroupPositions = (
  width,
  height,
  level,
  matrixes,
  type
) => {
  const ret: GroupPosition[] = [];
  const { DX, DY, A, numRows, numColumns, x0, y0 } = getCanvasValues(
    width,
    height,
    level
  );
  return ret;
};

export const getSampleViewPosition: Positioner.GetViewPositions<'dev'> = (
  width,
  height,
  level,
  maxRow,
  canvasColumn,
  options
) => {
  const sortedData = savedViews.developer[level];

  const pods: Matrix[] = [];
  const deployments: [Matrix, Matrix][] | null = options.showDeployments
    ? []
    : null;
  const namespaces: [Matrix, Matrix][] | null = options.showNamespaces
    ? []
    : null;

  return {
    block: getBlockPositions(width, height, level, pods, 'pod'),
    group1: getGroupPositions(width, height, level, deployments, 'deployment'),
    group2: getGroupPositions(width, height, level, namespaces, 'namespace'),
  };
};

/**
 * Grid 레벨에 따른 Pod, Deployment, Namespace 의 포인트들을 입력합니다.
 * @see @types/positioner/index.d.ts
 * @param pods
 * @param level
 * @param maxRow
 * @param canvasColumn
 * @param options
 * @returns {{pods: PointPosition[]; deployments: GroupPosition[] | null; namespaces: GroupPosition[] | null }} 포인트 값
 */
export const getDeveloperViewPositions: Positioner.GetViewPositions<'dev'> = (
  width,
  height,
  level,
  maxRow,
  canvasColumn,
  options
) => {
  const sortedData = savedViews.developer;
  const counts: Record<string, number> = {};
  const pods: Matrix[] = [];
  const deployments: [Matrix, Matrix][] | null = options.showDeployments
    ? []
    : null;
  const namespaces: [Matrix, Matrix][] | null = options.showNamespaces
    ? []
    : null;

  let selRow: number = 0;
  let selCol: number = 0;
  const dataLength: number = sortedData.pods.length;

  sortedData.pods.forEach((el) => {
    if (!!counts[el.deploymentId]) {
      counts[el.deploymentId]++;
    } else {
      counts[el.deploymentId] = 1;
    }
  });

  if (!options.showDeployments && !options.showNamespaces) {
    if (maxRow * canvasColumn > dataLength) {
      selCol = canvasColumn - 1;
      selRow = parseInt('' + dataLength / canvasColumn) - 1;
    } else {
      selCol = parseInt('' + dataLength / maxRow) - 1;
      selRow = maxRow - 1;
    }
    if (selCol > 0 && selRow > 0) {
      Array.from(Array(selRow).keys()).map((row) => {
        Array.from(Array(selCol).keys()).map((column) => {
          const pos = {
            row,
            column,
          };
          pods.push(pos);
        });
      });
    }
  } else if (
    options.showDeployments === true ||
    options.showNamespaces === false
  ) {
  } else if (
    options.showDeployments === false ||
    options.showNamespaces === true
  ) {
  } else {
  }

  return {
    block: getBlockPositions(width, height, level, pods, 'pod'),
    group1: getGroupPositions(width, height, level, deployments, 'deployment'),
    group2: getGroupPositions(width, height, level, namespaces, 'namespace'),
  };
};

export const GetAdminViewPositions: Positioner.GetViewPositions<'admin'> = (
  width,
  height,
  level,
  maxRow,
  canvasColumn,
  options
) => {
  const sortedData = savedViews.admin;

  const pods: Matrix[] | null = options.showPods ? [] : null;
  const nodes: [Matrix, Matrix][] | Matrix[] = [];
  const clusters: [Matrix, Matrix][] | null = options.showClusters ? [] : null;

  if (options.showPods) {
    return {
      block: getBlockPositions(width, height, level, pods, 'pod'),
      group1: getGroupPositions(
        width,
        height,
        level,
        nodes as [Matrix, Matrix][],
        'node'
      ),
      group2: getGroupPositions(width, height, level, clusters, 'cluster'),
    };
  } else {
    return {
      block: getBlockPositions(width, height, level, nodes as Matrix[], 'node'),
      group1: getGroupPositions(
        width,
        height,
        level,
        nodes as [Matrix, Matrix][],
        'node'
      ),
      group2: null,
    };
  }
};
