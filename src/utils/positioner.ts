import { GRID_SIZE, MAX_COLUMN_OBJECT, SPACING } from '~constants';

const DX = 4 * (GRID_SIZE + SPACING);
const DY = 2 * GRID_SIZE + SPACING;

let savedPositions: Record<number, Position[]> = {};
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
export const getGridPositions: Positioner.GetGridPositions = (
  width,
  height,
  level
) => {
  const ret: Position[] = [];
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
          const pos: Position = {
            x: x0 + px * DX,
            y: y0 + py * DY,
            row: row0 + row,
            column: column0 + column,
            type: 'point',
          };
          let saved = savedPositions[py * MAX_COLUMN_OBJECT + px];

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
        const bucket: Position[] = [];
        Array.from(Array(numColumns).keys()).map((px, column) => {
          const pos: Position = {
            x: x0 + px * DY + DY / 2,
            y: y0 + py * DY + DY / 2,
            row: row0 + row,
            column: column0 + column,
            type: 'point',
          };
          let saved = savedPositions[py * 1000 + px];

          bucket.push(pos);
          if (!!!saved) {
            saved = [pos];
          } else {
            saved.push(pos);
          }
        });
        ret.push(...bucket.reverse()); //우상단 ~ 좌하단 배치

        return ret;
      });
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
      row: row0 + parseInt('' + (y - y0) / DY),
      column: column0 + parseInt('' + (x - x0) / DX),
      type: 'point',
    };
  }
};
