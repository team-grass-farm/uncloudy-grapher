declare type PointType = 'pod' | 'node' | 'point';
declare type GroupType = 'deployment' | 'namespace' | 'cluster' | 'node';

declare interface PointPosition {
  x: number;
  y: number;
  row: number;
  column: number;
  type: PointType;
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
