declare namespace Positioner {
  type GetPointPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => PointPosition[];

  type GetLinePositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => LinePosition[];

  type GetGroupPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    data: any[],
    showSubGroup?: boolean
  ) => GroupPositions[];

  type GetHighlightedPointPosition = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    px: number,
    py: number
  ) => SelectedPointPosition | null;
}
