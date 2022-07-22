import { DELTA, MAX_COLUMN_OBJECT } from '~constants';
import { Pod } from '~models';

let savedPointPositions: Record<number, PointPosition[]> = {};
let savedLinePositions: Record<number, LinePosition[]> = {};

const getCanvasValues = (width: number, height: number, level: 1 | 2 | 3) => {
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
  (width, height, level, px, py) => {
    const { DX, DY, x0, y0, row0, column0 } = getCanvasValues(
      width,
      height,
      level
    );
    const hitboxX = 15,
      hitboxY = 15;
    const x = px + 7,
      y = py + 7;

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

/**
 * Grid 레벨에 따른 Deployment 의 시작점, 끝점 위치를 정합니다.
 * @param datas : fetcher 에서 받는 deployment들의 정보 (SAMPLE_DEPLOYMENTS);
 * @param width : 브라우저 내 렌더링된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : Grid View
 * @returns {GroupPositions[]}: 캔버스 안에 존재하는 deployment 들의 위치
 * @see @types/positioner/index.d.ts
 */
export const getDeploymentPositions: Positioner.GetGroupPositions = (
  width,
  height,
  level,
  data: Pod[]
) => {
  const ret: GroupPosition[] = [];
  const counts: Record<string, number> = {};

  data.map((pod) => {
    if (!!counts[pod.deploymentId]) {
      counts[pod.deploymentId]++;
    } else {
      counts[pod.deploymentId] = 1;
    }
  });

  // 하위 요소들을 가져와서 같은 부모인 애들만 묶는 로직, 개수 파악해서 리턴값에 필요한 애들 채우기
  return ret;
};

export const getNamespacePositions: Positioner.GetGroupPositions = (
  width,
  height,
  level,
  data: Pod[],
  showDeploymentGroup
) => {
  const ret: GroupPosition[] = [];
  const namespaceCounts: Record<string, number> = {};

  let podCounts: number;
  if (showDeploymentGroup) {
    const deploymentPositions = getDeploymentPositions(
      width,
      height,
      level,
      data
    );

    // TODO ....
  } else {
    data.map((pod) => {
      if (!!namespaceCounts[pod.deploymentId]) {
        namespaceCounts[pod.deploymentId]++;
      } else {
        namespaceCounts[pod.deploymentId] = 1;
      }
    });
  }

  return ret;
};

export const getClusterPositions: Positioner.GetGroupPositions = (
  width,
  height,
  level,
  data: Node[]
) => {
  const ret: GroupPosition[] = [];

  return ret;
};
