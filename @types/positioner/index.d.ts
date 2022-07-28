declare namespace Positioner {
  type GetPointPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => PointPosition[];

  type GetGroupPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    data: any[],
    showSubGroup?: boolean
  ) => GroupPositions[];

  type GetBoundedObject = (x: number, y: number) => SelectedPosition | null;
}
