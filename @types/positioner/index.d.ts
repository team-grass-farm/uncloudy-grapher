declare namespace Positioner {
  interface Positions {
    x: number;
    y: number;
  }

  type GetGridPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => Positions[][];
}
