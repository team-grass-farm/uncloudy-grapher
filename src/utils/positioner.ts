/**
 * @module positioner
 */
import { DELTA, MAX_COLUMN_OBJECT } from '~constants';
import { report } from '~utils/logger';

// const plots:

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
  _cx,
  _cy,
  pov = 0,
  hitbox = 0
) => {
  const { DX, DY, x0, y0, row0, column0 } = getCanvasValues(
    width,
    height,
    level
  );

  const cx = _cx;
  const cy = _cy;

  let px: number, py: number;
  switch (level) {
    case 1:
    case 2:
      px = -pov + cx - (x0 - (row0 + column0 + 1) * DX);
      py = pov * 0.57 + cy - (y0 + (row0 - column0) * DY);

      // NOTE that this equations are derived from 2D affine matrix transformation.
      const column = Math.floor((DY * px + DX * py) / (2 * DX * DY));
      const row = Math.floor((DY * px - DX * py) / (2 * DX * DY));
      return { x: cx, y: cy, row, column, type: 'point' };
    case 3:
      px = -pov + cx - x0 + (DX >> 1);
      py = pov * 0.57 + cy - y0 + (DY >> 1);

      const hitboxX = DX * hitbox,
        hitboxY = DY * hitbox;
      const glitchX = hitboxX >> 1,
        glitchY = hitboxY >> 1;

      if ((px + glitchX) % DX > hitboxX || (py + glitchY) % DY > hitboxY) {
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
    row0: 10,
    column0: -10,
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
            });
          } else {
            ret.push({
              x: x0 + px * DX,
              y: y0 + py * 2 * DY + (px % 2 ? DY : 0),
              row: row0 - py + (px >> 1),
              column: column0 + py + ((px + 1) >> 1),
            });
          }
        });
      });
      break;
    case 3:
      Array.from(Array(numRows).keys()).map((py) => {
        Array.from(Array(numColumns).reverse().keys()).map((px) => {
          ret.push({
            x: x0 + px * DX,
            y: y0 + py * DY,
            row: row0 + py,
            column: column0 + px,
          });
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
const getPointPosition: Positioner.GetPointPosition = (c, matrix, z) => {
  const { row, column } = matrix;
  const x = c.x0 + (row - c.row0 + column - c.column0) * c.DX;
  const y = c.y0 + (-row + c.row0 + column - c.column0) * c.DY;
  return { x, y, z, row, column };
};

/**
 * row, column이 지정된 복수 블록 포지션에 대한 x, y 좌표를 구합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param matrixes : 포지션이 필요한 리소스 배결
 * @param type : 그룹 타입
 * @returns {BlockPositions}
 */
const getBlockPositions: Positioner.GetBlockPositions = (
  width,
  height,
  level,
  matrixes,
  kind
) => {
  if (!!!matrixes) return null;
  const canvasValues = getCanvasValues(width, height, level);
  let highest = 50;

  const data: Map<string, PointPosition> = new Map(
    Array.from(matrixes.entries(), ([_, matrix]) => [
      [matrix.row, matrix.column].toString(),
      getPointPosition(
        canvasValues,
        matrix,
        highest - (Math.random() * 20 + 5)
      ),
    ])
  );

  return {
    kind,
    viewType: level === 3 ? 'flat' : 'normal',
    dx: canvasValues.DX,
    dy: canvasValues.DY,
    dz: 1,
    data,
  };
};

/**
 * row, column이 지정된 복수 그룹 포지션에 대한 x, y 좌표를 구합니다.
 * @param width : 브라우저 내 렌더링 된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : 현재 Grid 뷰 레벨
 * @param matrixes : 포지션이 필요한 리소스 배결
 * @param type : 그룹 타입
 * @returns {GroupPositions}
 * @see @types/positioner/index.d.ts
 */
const getGroupPositions: Positioner.GetGroupPositions = (
  width,
  height,
  level,
  matrixes,
  kind
) => {
  if (!!!matrixes) return null;
  const canvasValues = getCanvasValues(width, height, level);

  const data: Map<string, { start: PointPosition; end: PointPosition }> =
    new Map(
      Array.from(matrixes.entries(), ([_, matrixSet]) => [
        [
          matrixSet[0].row,
          matrixSet[0].column,
          matrixSet[1].row,
          matrixSet[1].column,
        ].toString(),
        {
          start: getPointPosition(canvasValues, matrixSet[0]),
          end: getPointPosition(canvasValues, matrixSet[1]),
        },
      ])
    );

  return {
    kind,
    viewType: level === 3 ? 'flat' : 'normal',
    dx: canvasValues.DX,
    dy: canvasValues.DY,
    data,
  };
};

const getSelectedBox = (maxCol: number, blockLength: number): Matrix | null => {
  const sqrt = Math.sqrt(blockLength);
  let row: number;
  let column: number;

  if (sqrt < maxCol) {
    row = Math.floor(sqrt);
    column = Math.ceil(sqrt);
  } else {
    column = maxCol;
    row = Math.ceil(blockLength / maxCol);
    report.debug('Positioner', ['case B']);
  }

  return row * column > 0 ? { row, column } : null;
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
  resourceMap,
  width,
  height,
  level
) => {
  const pods: Matrix[] = [];
  const deployments: [Matrix, Matrix][] | null = !!resourceMap.deployments
    ? []
    : null;
  const namespaces: [Matrix, Matrix][] | null = !!resourceMap.namespaces
    ? []
    : null;

  // TODO: calculate maxRow and canvasColumn instead of parameters
  const canvasColumn = 6;
  const canvasRow = 20;
  const availableCanvasRow = 3;

  if (!!!resourceMap.deployments && !!!resourceMap.namespaces) {
    let selBox = getSelectedBox(canvasColumn, resourceMap.pods.size);

    if (!!selBox) {
      Array.from(Array(selBox.row).keys())
        .reverse()
        .map((row) => {
          Array.from(Array(selBox!.column).keys()).map((column) => {
            pods.push({ row, column });
          });
        });
    }
  } else if (!!resourceMap.deployments && !!!resourceMap.namespaces) {
    report.log('Positioner', [
      { deploymentSize: resourceMap.deployments.size },
    ]);

    let rowCount = 0;
    let sel1Groups: { group: Matrix; startRow: number; numPods: number }[] = [];

    resourceMap.deployments.forEach((_, deploymentId) => {
      let numPods = [...resourceMap.pods].filter(
        ([_, pod]) => pod.deploymentId === deploymentId
      ).length;
      let sel1Group = getSelectedBox(canvasColumn - 2, numPods);

      report.debug('Positioner', [
        'sel1Group: ',
        sel1Group,
        'numPods: ',
        numPods,
      ]);

      if (!!sel1Group) {
        sel1Groups.push({
          group: {
            row: sel1Group.row,
            column: sel1Group.column,
          },
          startRow: rowCount,
          numPods,
        });
        rowCount += sel1Group.row + 1;
      }
    });

    report.debug('Positioner', [{ rowCount, sel1Groups }]);

    let thresholdRow = Math.floor(rowCount / availableCanvasRow);
    let paddingCol = 0;
    let paddingRow = 0;
    let precedingRow = 0;
    let maxColOnRow = 0;
    let index = 0;

    sel1Groups.forEach(({ group, startRow, numPods }, deploymentId) => {
      report.debug('Positioner', [{ group, startRow, numPods }]);

      if (precedingRow > thresholdRow) {
        report.debug('Positioner', ['executed newline', { maxColOnRow }]);
        paddingCol += 1 + maxColOnRow;
        paddingRow += 4;
        maxColOnRow = 0;
        precedingRow = 0;
      }

      if (!!group) {
        let podCount = numPods;
        report.debug('Positioner', ['podCount: ', numPods]);
        Array.from(Array(group.row).keys())
          .reverse()
          .map((row) => {
            Array.from(Array(group.column).keys()).forEach(
              (column) =>
                --podCount >= 0 &&
                pods.push({
                  row: paddingRow + precedingRow + row,
                  column: paddingCol + column,
                })
            );
          });

        deployments!.push([
          { row: paddingRow + precedingRow, column: paddingCol },
          {
            row: paddingRow + precedingRow + group.row - 1,
            column: paddingCol + group.column - 1,
          },
        ]);

        precedingRow += group.row + 1;
        maxColOnRow = Math.max(maxColOnRow, group.column);
        index++;
      }
    });
    report.log('Positioner', ['deployments: ', deployments]);
  } else if (!!!resourceMap.deployments && !!resourceMap.namespaces) {
    // // NOTE This is a sample code:
    // if (maxRow * canvasColumn > dataLength) {
    //   selCol = canvasColumn - 1;
    //   selRow = parseInt('' + dataLength / canvasColumn) - 1;
    // } else {
    //   selCol = parseInt('' + dataLength / maxRow) - 1;
    //   selRow = maxRow - 1;
    // }
    // if (selCol > 0 && selRow > 0) {
    //   Array.from(Array(selRow).keys())
    //     .reverse()
    //     .map((row) => {
    //       Array.from(Array(selCol).keys()).map((column) => {
    //         pods.push({ row, column });
    //       });
    //     });
    // }
    // namespaces!.push([
    //   { row: 3, column: 3 },
    //   { row: selRow, column: selCol },
    // ]);
  } else {
  }

  return {
    blocks: getBlockPositions(width, height, level, pods, 'pods')!,
    groups1: getGroupPositions(
      width,
      height,
      level,
      deployments,
      'deployments'
    ),
    groups2: getGroupPositions(width, height, level, namespaces, 'namespaces'),
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
  resourceMap,
  width,
  height,
  level
) => {
  const pods: Matrix[] | null = !!resourceMap.pods ? [] : null;
  const nodes: [Matrix, Matrix][] & Matrix[] = [];
  const clusters: [Matrix, Matrix][] | null = !!resourceMap.clusters
    ? []
    : null;

  const maxRow = 10;
  const canvasColumn = 8;

  let nodeLength = resourceMap.nodes ? resourceMap.nodes.size : 0,
    selRow: number,
    selCol: number;

  if (!!!resourceMap.clusters && !!!resourceMap.pods) {
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

  if (!!resourceMap.pods) {
    return {
      blocks: getBlockPositions(width, height, level, pods, 'pods')!,
      groups1: getGroupPositions(
        width,
        height,
        level,
        nodes as [Matrix, Matrix][],
        'nodes'
      ),
      groups2: getGroupPositions(width, height, level, clusters, 'clusters'),
    };
  } else {
    return {
      blocks: getBlockPositions(
        width,
        height,
        level,
        nodes as Matrix[],
        'nodes'
      )!,
      groups1: getGroupPositions(
        width,
        height,
        level,
        nodes as [Matrix, Matrix][],
        'nodes'
      ),
      groups2: null,
    };
  }
};
