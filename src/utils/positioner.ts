import { SPACING } from '~constants';

const GRID_SIZE = 10;
const DX = 2 * (GRID_SIZE + SPACING);
const DY = GRID_SIZE + SPACING;

/**
 * Grid 레벨에 따른 렌더링 위치를 정의합니다.
 * @param width : 브라우저 내 렌더링된 canvas 너비;
 * @param height : 브라우저 내 렌더링 된 canvas 높이;
 * @param level : Grid View
 * @returns {Positioner.Positions[][]} 2차원 좌표값
 * @see @types/positioner/index.d.ts
 */
export const getGridPositions: Positioner.GetGridPositions = (
  width,
  height,
  level
) => {
  const positions: Positioner.Positions[][] = [];
  const x0 = 0,
    y0 = 0;

  switch (level) {
    case 1:
      // TODO 1레벨 Grid 뷰 코드 완성하기
      break;
    case 2:
      Array.from(Array(parseInt('' + height / DY, 10) + 1).keys()).map((py) => {
        const rows: Positioner.Positions[] = [];
        Array.from(Array(parseInt('' + width / DX, 10) + 1).keys()).map(
          (px) => {
            rows.push({ x: x0 + px * DX, y: y0 + py * DY });
          }
        );
      });
      break;
    case 3:
      // TODO 3레벨 Grid 뷰 코드 완성하기
      break;
  }

  return positions;
};
