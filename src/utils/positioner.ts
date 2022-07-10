import { GRID_SIZE, MAX_COLUMN_OBJECT, SPACING } from '~constants';

const DX = 4 * (GRID_SIZE + SPACING);
const DY = 2 * GRID_SIZE + SPACING;

let savedPositions: Record<number, Position[]> = {};
let x0: number = 0,
  y0: number = 0;

/**
 * Grid 레벨에 따른 렌더링 위치를 정의합니다.
 * @param width : 브라우저 내 렌더링된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : Grid View
 * @returns {Position[]}: 렌더링 가능한 모든 포지션
 * @see @types/positioner/index.d.ts
 */
export const getGridPositions: Positioner.GetGridPositions = (
  width,
  height,
  level
) => {
  const ret: Position[] = [];
  x0 = parseInt('' + (width % DX) / 2, 10);

  switch (level) {
    case 1:
      // TODO 1레벨 Grid 뷰 코드 완성하기
      break;
    case 2:
      Array.from(Array(parseInt('' + height / DY, 10) + 1).keys()).map(
        (py, row) => {
          Array.from(Array(parseInt('' + width / DX, 10) + 1).keys()).map(
            (px, column) => {
              const pos: Position = {
                x: x0 + px * DX,
                y: y0 + py * DY,
                row,
                column,
                type: 'point',
              };
              let saved = savedPositions[py * MAX_COLUMN_OBJECT + px];

              ret.push(pos);
              if (!!!saved) {
                saved = [pos];
              } else {
                saved.push(pos);
              }
            }
          );
        }
      );
      break;
    case 3:
      // TODO 3레벨 Grid 뷰 코드 완성하기
      break;
  }

  return ret;
};

export const resetGridPositions = () => {
  savedPositions = {};
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
      row: parseInt('' + (y - y0) / DY, 10),
      column: parseInt('' + (x - x0) / DX, 10),
      type: 'point',
    };
  }
};
