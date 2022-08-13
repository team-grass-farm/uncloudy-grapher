declare type Dimensions = Record<'width' | 'height', number>;

declare type PointType = 'pod' | 'node' | 'point';
declare type LineType = 'grid';
declare type GroupType = 'deployment' | 'namespace' | 'cluster' | 'node';

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
  zIndex: number;
  type: GroupType;
}

declare interface BlockPositions {
  viewType: 'flat' | 'normal';
  dx: number;
  dy: number;
  dz?: number;
  data: PointPosition[];
}

declare interface GroupPositions {
  viewType: 'flat' | 'normal';
  dx: number;
  dy: number;
  dz?: number;
  data: GroupPosition[];
}
