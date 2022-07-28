import { GRID_SIZE, MAX_COLUMN_OBJECT, SPACING } from '~constants';
import { Pod } from '~models';

const DX = 4 * (GRID_SIZE + SPACING);
const DY = 2 * GRID_SIZE + SPACING;

let savedPointPositions: Record<number, PointPosition[]> = {};
let x0: number = 0,
  y0: number = 0;
let row0: number = 0,
  column0: number = 0;

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
  let numRows: number, numColumns: number;
  x0 = parseInt('' + (width % DX) / 2);

  switch (level) {
    case 1:
      // TODO 1레벨 Grid 뷰 코드 완성하기
      break;
    case 2:
      numRows = parseInt('' + height / DY) + 1;
      numColumns = parseInt('' + width / DX) + 1;
      row0 = -parseInt('' + numRows / 2);
      column0 = -parseInt('' + numColumns / 2);

      Array.from(Array(numRows).keys()).map((py, row) => {
        Array.from(Array(numColumns).keys()).map((px, column) => {
          const pos: PointPosition = {
            x: x0 + px * DX,
            y: y0 + py * DY,
            row: row0 + row,
            column: column0 + column,
            type: 'point',
          };
          let saved = savedPointPositions[py * MAX_COLUMN_OBJECT + px];

          ret.push(pos);
          if (!!!saved) {
            saved = [pos];
          } else {
            saved.push(pos);
          }
        });
      });
      break;
    case 3:
      numRows = parseInt('' + height / DY) + 1;
      numColumns = parseInt('' + width / DY) + 1;
      row0 = -parseInt('' + numRows / 2);
      column0 = -parseInt('' + numColumns / 2);

      Array.from(Array(numRows).keys()).map((py, row) => {
        const bucket: PointPosition[] = [];
        Array.from(Array(numColumns).keys()).map((px, column) => {
          const pos: PointPosition = {
            x: x0 + px * DY + DY / 2,
            y: y0 + py * DY + DY / 2,
            row: row0 + row,
            column: column0 + column,
            type: 'point',
          };
          let saved = savedPointPositions[py * 1000 + px];

          bucket.push(pos);
          if (!!!saved) {
            saved = [pos];
          } else {
            saved.push(pos);
          }
        });
        ret.push(...bucket.reverse()); //우상단 ~ 좌하단 배치
      });
      break;
  }

  return ret;
};

export const resetGridPositions = () => {
  savedPointPositions = {};
};

export const getBoundedObject: Positioner.GetBoundedObject = (px, py) => {
  const hitboxX = 15,
    hitboxY = 15;
  const x = px + 7,
    y = py + 7;

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
