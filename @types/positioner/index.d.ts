declare namespace Positioner {
  type GetGridPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => Position[];

  type GetBoundedObject = (x: number, y: number) => SelectedPosition | null;
}
