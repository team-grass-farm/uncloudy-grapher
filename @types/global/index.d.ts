declare type PointType = 'pod' | 'node' | 'point';
declare type LineType = 'grid';
declare type GroupType = 'deployment' | 'namespace' | 'cluster' | 'node';

declare interface PointPosition {
  x: number;
  y: number;
  row: number;
  column: number;
  type: PointType;
}

declare interface LinePosition {
  x: number;
  y: number;
  dx: number;
  dy: number;
  type: LineType;
}

declare interface GroupPosition {
  start: PointPosition;
  end: PointPosition;
  width: number;
  height: number;
  zIndex: number;
  type: GroupType;
}

declare interface SelectedPointPosition extends PointPosition {}
