import { DELTA, MAX_COLUMN_OBJECT } from '~constants';

const savedPointPositions: Record<number, PointPosition[]> = {};
const savedPods: Record<number, Matrix> = {};
const savedNodes: Record<number, Matrix> = {};
const savedDeployments: Record<number, [Matrix, Matrix]> = {};
const savedNamespaces: Record<number, [Matrix, Matrix]> = {};
const savedClusters: Record<number, [Matrix, Matrix]> = {};

const savedViews: Positioner.SavedViews = {
  admin: {
    pods: [],
    nodes: [],
    clusters: [],
  },
  developer: {
    pods: [],
    deployments: [],
    namespaces: [],
  },
};

export const addPods: Positioner.AddResource<Resource.Pod> = (pods) => {
  savedViews.admin.pods = pods;
  savedViews.developer.pods = pods;
  pods.forEach((pod) => {
    savedViews.developer.deployments.push({
      id: pod.deploymentId,
      shortId: pod.deploymentId.split('-deployment-')[0],
      replicas: null,
      availableReplicas: null,
      namespace: pod.namespace,
    });
    savedViews.developer.namespaces.push(pod.namespace);
  });
};

export const addNodes: Positioner.AddResource<Resource.Node> = (nodes) => {
  savedViews.admin.nodes = nodes;
  nodes.forEach((node) => {
    savedViews.admin.clusters.push({
      id: node.region,
    });
  });
};

/**
 * 움직이는 커서의 포지션에 따라 포인트 포지션을 구합니다. 2D Shearing 과 2D Rotation 회전변환을 이용합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param cx : 마우스 커서 x의 위치
 * @param cy : 마우스 커서 y의 위치
 * @param hitbox : 중앙 기준 커서의 유효 범위
 * @returns { PointPosition | null }
 * @see @types/positioner/index.d.ts
 */
export const getCursorPosition: Positioner.GetCursorPosition = (
  width,
  height,
  level,
  cx,
  cy,
  hitbox = 0
) => {
  const { DX, DY, x0, y0, row0, column0 } = getCanvasValues(
    width,
    height,
    level
  );

  let px: number, py: number;
  switch (level) {
    case 1:
    case 2:
      px = cx - (x0 - (row0 + column0 + 1) * DX);
      py = cy - (y0 + (row0 - column0) * DY);

      // NOTE that this equations are derived from 2D affine matrix transformation.
      const column = Math.floor((DY * px + DX * py) / (2 * DX * DY));
      const row = Math.floor((DY * px - DX * py) / (2 * DX * DY));
      return { x: cx, y: cy, row, column, type: 'point' };
    case 3:
      px = cx - x0 + (DX >> 1);
      py = cy - y0 + (DY >> 1);

      const hitboxX = DX * hitbox,
        hitboxY = DY * hitbox;
      const glitchX = hitboxX >> 1,
        glitchY = hitboxY >> 1;

      if (!!!hitbox) {
        return null;
      } else if (
        (px + glitchX) % DX > hitboxX ||
        (py + glitchY) % DY > hitboxY
      ) {
        return null;
      } else {
        return {
          x: cx,
          y: cy,
          row: row0 + parseInt('' + py / DY),
          column: column0 + parseInt('' + px / DX),
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
    x0: width % (DX * (level === 3 ? 2 : 4)) >> 1,
    y0: level === 3 ? DY >> 1 : DY,
    row0: 2,
    column0: -5,
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
      Array.from(Array(parseInt('' + numRows) + 1).keys()).map((py) => {
        Array.from(Array(numColumns).keys()).map((px) => {
          // const pos: PointPosition = {
          //   x: x0 + px * DX,
          //   y: y0 + py * 2 * DY + (px % 2 ? DY : 0),
          //   row: row0 + py + 1 - parseInt('' + ((column0 + px) >> 1)),
          //   column: column0 + px,
          //   type: 'point',
          // };

          if (!(px % 2)) {
            ret.push({
              x: x0 + px * DX,
              y: y0 + py * 2 * DY + (px % 2 ? DY : 0),
              row: row0 - py + (px >> 1),
              column: column0 + py + (px >> 1),
              type: 'point',
            });
          } else {
            ret.push({
              x: x0 + px * DX,
              y: y0 + py * 2 * DY + (px % 2 ? DY : 0),
              row: row0 - py + (px >> 1),
              column: column0 + py + ((px + 1) >> 1),
              type: 'point',
            });
          }

          // let saved = savedPointPositions[py * MAX_COLUMN_OBJECT + px];
          // if (!!!saved) {
          //   saved = [pos];
          // } else {
          //   saved.push(pos);
          // }
        });
      });
      break;
    case 3:
      Array.from(Array(numRows).keys()).map((py) => {
        Array.from(Array(numColumns).reverse().keys()).map((px) => {
          const pos: PointPosition = {
            x: x0 + px * DX,
            y: y0 + py * DY,
            row: row0 + py,
            column: column0 + px,
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
          const row = parseInt('' + (y - y0) / (2 * DY));
          const column = parseInt('' + (x - x0) / DX);
          if (!(column % 2)) {
            if ((y - y0) % (2 * DY) < hitboxY) {
              return {
                x,
                y,
                row: row0 - row + (column >> 1),
                column: column0 + column + row - (column >> 1),
                type: 'point',
              };
            } else return null;
          } else {
            if ((y - DY - y0) % (2 * DY) < hitboxY) {
              return {
                x,
                y,
                row: row0 - row + (column >> 1),
                column: column0 + column + row - (column >> 1),
                type: 'point',
              };
            } else return null;
          }
        } else {
          return null;
        }
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

// const getPointPosition: Positioner.GetPointPosition = (matrix) => {
//   return {
//     x
//   }
// }

const getBlockPositions: Positioner.GetBlockPositions = (
  width,
  height,
  level,
  matrixes,
  type
) => {
  if (!!!matrixes) return [];
  const { DX, DY, x0, y0, row0, column0 } = getCanvasValues(
    width,
    height,
    level
  );
  let highest = 50;
  return matrixes.map((matrix) => {
    const { row, column } = matrix;
    console.debug(`[Pos] row: ${row} column: ${column}`);
    const x = x0 + (row - row0 + column - column0) * DX;
    const y = y0 + (-row + row0 + column - column0) * DY;
    return {
      x,
      y,
      z: highest - (Math.random() * 20 + 5),
      row: matrix.row,
      column: matrix.column,
      type,
    };
  });
};

const getGroupPositions: Positioner.GetGroupPositions = (
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
      Array.from(Array(selRow).keys())
        .reverse()
        .map((row) => {
          Array.from(Array(selCol).keys()).map((column) => {
            const pos = {
              row,
              column,
            };
            pods.push(pos);
          });
        });
    }
  } else if (options.showDeployments && !options.showNamespaces) {
  } else if (!options.showDeployments && options.showNamespaces) {
  } else {
  }

  return {
    block: getBlockPositions(width, height, level, pods, 'pod'),
    group1: getGroupPositions(width, height, level, deployments, 'deployment'),
    group2: getGroupPositions(width, height, level, namespaces, 'namespace'),
  };
};

export const getAdminViewPositions: Positioner.GetViewPositions<'admin'> = (
  width,
  height,
  level,
  maxRow,
  canvasColumn,
  options
) => {
  const sortedData = savedViews.admin;
  const pods: Matrix[] | null = options.showPods ? [] : null;
  const nodes: [Matrix, Matrix][] & Matrix[] = [];
  const clusters: [Matrix, Matrix][] | null = options.showClusters ? [] : null;

  let nodeLength = sortedData.nodes.length,
    selRow: number,
    selCol: number;

  if (!options.showClusters && !options.showPods) {
    if (maxRow * canvasColumn > nodeLength) {
      selCol = canvasColumn - 1;
      selRow = parseInt('' + nodeLength / canvasColumn) - 1;
    } else {
      selCol = parseInt('' + nodeLength / maxRow) - 1;
      selRow = maxRow - 1;
    }

    if (selCol > 0 && selRow > 0) {
      Array.from(Array(selRow).keys())
        .reverse()
        .map((row) => {
          Array.from(Array(selCol).keys()).map((column) => {
            nodes.push({ row, column });
          });
        });
    }
  }

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
