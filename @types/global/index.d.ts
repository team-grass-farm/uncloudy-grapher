declare type PointType = 'pod' | 'node' | 'point';
declare type LineType = 'grid';
declare type GroupType = 'deployment' | 'namespace' | 'cluster' | 'node';
declare type Layer = 'group2' | 'group1' | 'block';

declare interface Matrix {
  row: number;
  column: number;
}

declare interface PointPosition {
  x: number;
  y: number;
  z?: number;
  row: number;
  column: number;
  type: PointType;
}

declare interface LinePosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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
