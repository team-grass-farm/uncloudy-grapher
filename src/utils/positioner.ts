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

/**
 * 포지셔닝 할 pod 리소스를 추가합니다.
 * @param pods
 * @see @types/positioner/index.d.ts
 */
export const addPods: Positioner.AddResource<Resource.Pod> = (pods) => {
  savedViews.admin.pods = savedViews.developer.pods = Array.from(pods.values());
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

  console.debug(
    `[Positioner] stored ${savedViews.developer.pods.length} pods.`
  );
};

/**
 * 포지셔닝 할 node 리소스를 추가합니다.
 * @param nodes
 * @see @types/positioner/index.d.ts
 */
export const addNodes: Positioner.AddResource<Resource.Node> = (nodes) => {
  savedViews.admin.nodes = Object.values(nodes);
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

/**
 * Positioning 기능 구현을 위해 렌더링된 Canvas에 의존적인 좌표 정보들을 반환하는 내부합수입니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된
 * @param level : Grid 뷰 레벨
 * @returns {DX, DY, A, numRows, numColumns, x0, y0, row0, column0}
 * @see @types/positioner/index.d.ts
 */
const getCanvasValues: Positioner.GetCanvasValues = (width, height, level) => {
  const { DX, DY, A } = DELTA[level];
  const numRows = parseInt('' + height / (DY * (level === 3 ? 1 : 2))) + 1;
  const numColumns = parseInt('' + width / DX) + 1;

  let x0: number, y0: number;
  if (level === 3) {
    x0 = width % (DX * 2) >> 1;
    y0 = DY >> 1;
  } else if (level === 2) {
    x0 = width % (DX * 4) >> 1;
    y0 = DY;
  } else {
    x0 = width % (DX * 4) >> 1;
    y0 = -50;
  }

  return {
    DX,
    DY,
    A,
    numRows,
    numColumns,
    x0,
    y0,
    row0: 2,
    column0: -5,
  };
};

/**
 * 포인트 포지션의 렌더링 위치를 지정합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @returns {PointPosition[]}: 렌더링 가능한 모든 포지션
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
 * @deprecated
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param cx : 마우스 커서 x의 위치
 * @param cy : 마우스 커서 y의 위치
 * @returns {PointPosition | null}
 * @see @types/positioner/index.d.ts
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

/**
 * 격자 줄 포지션의 렌더링 위치를 지정합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @returns {LinePosition[]}
 * @see @types/positioner/index.d.ts
 */
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

        ret.push({
          x1: -y3 / A + x3,
          y1: 0,
          x2: (height - y3) / A + x3,
          y2: height,
          type: 'grid',
        });
        ret.push({
          x1: y4 / A + x4,
          y1: 0,
          x2: -(height - y4) / A + x4,
          y2: height,
          type: 'grid',
        });
      });
      break;
    case 3:
      Array.from(Array(numColumns).keys()).map((px) => {
        const x3 = x0 - DX / 2 + px * DX;

        ret.push({
          x1: x3,
          y1: 0,
          x2: x3,
          y2: height,
          type: 'grid',
        });
      });

      Array.from(Array(numRows).keys()).map((py) => {
        const y3 = y0 - DY / 2 + py * DY;

        ret.push({
          x1: 0,
          y1: y3,
          x2: width,
          y2: y3,
          type: 'grid',
        });
      });
      break;
  }

  return ret;
};

/**
 * row, column이 지정된 단일 포인트 포지션에 대한 x, y 좌표를 구합니다.
 * @param c : getCanvasValues()를 통해 얻어진 정보
 * @param matrix : 포지셔닝이 필요한 리소스
 * @param type : 포인트 타입;
 * @param z : 높이
 * @returns {PointPosition}
 * @see @types/positioner/index.d.ts
 */
const getPointPosition: Positioner.GetPointPosition = (c, matrix, type, z) => {
  const { row, column } = matrix;
  const x = c.x0 + (row - c.row0 + column - c.column0) * c.DX;
  const y = c.y0 + (-row + c.row0 + column - c.column0) * c.DY;
  return { x, y, z, row, column, type };
};

/**
 * row, column이 지정된 복수 포인트 포지션에 대한 x, y 좌표를 구합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param matrixes : 포지션이 필요한 리소스 배결
 * @param type : 그룹 타입
 * @returns {PointPosition[]}
 */
const getBlockPositions: Positioner.GetBlockPositions = (
  width,
  height,
  level,
  matrixes,
  type
) => {
  if (!!!matrixes) return [];
  const canvasValues = getCanvasValues(width, height, level);
  let highest = 50;
  return matrixes.map((matrix) => {
    return getPointPosition(
      canvasValues,
      matrix,
      type,
      highest - (Math.random() * 20 + 5)
    );
  });
};

/**
 * row, column이 지정된 복수 그룹 포지션에 대한 x, y 좌표를 구합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param matrixes : 포지션이 필요한 리소스 배결
 * @param type : 그룹 타입
 * @returns {GroupPosition[]}
 * @see @types/positioner/index.d.ts
 */
const getGroupPositions: Positioner.GetGroupPositions = (
  width,
  height,
  level,
  matrixes,
  type
) => {
  return [];
  // if (!!!matrixes) return [];
  // const canvasValues = getCanvasValues(width, height, level);
  // return matrixes.map(
  //   ([matrix1, matrix2]): GroupPosition => ({
  //     start: getPointPosition(canvasValues, matrix1, 'point'),
  //     end: getPointPosition(canvasValues, matrix2, 'point'),
  //     zIndex: 0,
  //     type,
  //   })
  // ) as GroupPosition[];
};

const getSelectedBox = (
  maxRow: number,
  maxCol: number,
  blockLength: number
): Matrix | null => {
  let row: number = 0;
  let column: number = 0;

  if (maxRow * maxCol > blockLength) {
    column = maxCol - 1;
    row = parseInt('' + blockLength / maxCol) - 1;
  } else {
    column = parseInt('' + blockLength / maxRow) - 1;
    row = maxRow - 1;
  }

  return { row, column };
};

/**
 * Grid 레벨에 따른 Pod, Deployment, Namespace 등의 리소스 맵을 반환하는 함수입니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param maxRow : Canvas 내 최대로 보여질 수 있는 행 수
 * @param canvasColumn : Canvas 내 최대로 보여질 수 있는 열 수 (단, 열은 스크롤을 통해 숨겨진 열을 볼 수 있다.)
 * @param options : 특정 그룹을 보여지게 할 지에 대한 옵션
 * @returns {PositionMap} 포인트 값
 * @see @types/positioner/index.d.ts
 */
export const getDeveloperViewPositions: Positioner.GetViewPositions<'dev'> = (
  width,
  height,
  level,
  options
) => {
  const sortedData = savedViews.developer;
  const pods: Matrix[] = [];
  const deployments: [Matrix, Matrix][] | null = options.showDeployments
    ? []
    : null;
  const namespaces: [Matrix, Matrix][] | null = options.showNamespaces
    ? []
    : null;

  // TODO: calculate maxRow, canvasColumn instead of parameters
  const maxRow = 10;
  const canvasColumn = 6;

  if (!options.showDeployments && !options.showNamespaces) {
    let selBox = getSelectedBox(maxRow, canvasColumn, sortedData.pods.length);

    if (!!selBox) {
      Array.from(Array(selBox.row).keys())
        .reverse()
        .map((row) => {
          Array.from(Array(selBox!.column).keys()).map((column) => {
            pods.push({ row, column });
          });
        });
    }
  } else if (options.showDeployments && !options.showNamespaces) {
    if (!!deployments) {
      const maxGroup1Row = ((maxRow - 1) >> 1) - 2;

      let paddingCol = 0;
      let secondRow = sortedData.deployments.length >> 1;

      sortedData.deployments.map((deployment, index) => {
        if (secondRow === index) {
          paddingCol = 0;
        }
        let paddingRow = secondRow >= index ? 0 : maxGroup1Row;
        let numPods = sortedData.pods.filter(
          (pod) => pod.deploymentId === deployment.id
        ).length;

        let selGroup1 = getSelectedBox(
          ((maxRow - 1) >> 1) - 2,
          canvasColumn - 2,
          numPods
        );

        if (!!selGroup1) {
          deployments.push([
            { row: paddingRow, column: paddingCol },
            {
              row: paddingRow + selGroup1.row,
              column: paddingCol + selGroup1.column,
            },
          ]);

          // NOTE 디플로이먼트 박스 안 - 파드 간 간격을 설정할 지의 여부
          // paddingRow++;
          // paddingCol++;

          Array.from(Array(selGroup1.row).keys())
            .reverse()
            .map((row) => {
              Array.from(Array(selGroup1!.column).keys()).map((column) => {
                pods.push({
                  row: paddingRow + row,
                  column: paddingCol + column,
                });
              });
            });

          paddingCol += selGroup1.column + 1;
        }
      });
    }
  } else if (!options.showDeployments && options.showNamespaces) {
    // NOTE This is a sample code:
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
            pods.push({ row, column });
          });
        });
    }
    namespaces!.push([
      { row: 3, column: 3 },
      { row: selRow, column: selCol },
    ]);
  } else {
  }

  return {
    block: getBlockPositions(width, height, level, pods, 'pod'),
    group1: getGroupPositions(width, height, level, deployments, 'deployment'),
    group2: getGroupPositions(width, height, level, namespaces, 'namespace'),
  };
};

/**
 * Grid 레벨에 따른 Pod, Node, Cluster 등의 리소스 맵을 반환하는 함수입니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param maxRow : Canvas 내 최대로 보여질 수 있는 행 수
 * @param canvasColumn : Canvas 내 최대로 보여질 수 있는 열 수 (단, 열은 스크롤을 통해 숨겨진 열을 볼 수 있다.)
 * @param options : 특정 그룹을 보여지게 할 지에 대한 옵션
 * @returns {PositionMap} 포인트 값
 * @see @types/positioner/index.d.ts
 */
export const getAdminViewPositions: Positioner.GetViewPositions<'admin'> = (
  width,
  height,
  level,
  options
) => {
  const sortedData = savedViews.admin;
  const pods: Matrix[] | null = options.showPods ? [] : null;
  const nodes: [Matrix, Matrix][] & Matrix[] = [];
  const clusters: [Matrix, Matrix][] | null = options.showClusters ? [] : null;

  const maxRow = 10;
  const canvasColumn = 8;

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
