declare type Dimensions = Record<'width' | 'height', number>;

declare type LineType = 'grid';
declare type BlockKind = 'pod' | 'node';
declare type GroupKind = 'deployment' | 'namespace' | 'cluster' | 'node';

declare interface Matrix {
  row: number;
  column: number;
}

declare interface LinePosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: LineType;
}

declare interface PointPosition {
  x: number;
  y: number;
  z?: number;
  row: number;
  column: number;
}

declare interface BlockPosition {
  kind: BlockKind;
  viewType: 'flat' | 'normal';
  dx: number;
  dy: number;
  dz?: number;
  data: PointPosition;
}

declare interface GroupPosition {
  kind: GroupKind;
  viewType: 'flat' | 'normal';
  zIndex: number;
  data: { start: PointPosition; end: PointPosition };
}

declare interface BlockPositions extends BlockPosition {
  kind: `${BlockKind}s`;
  viewType: 'flat' | 'normal';
  dx: number;
  dy: number;
  dz?: number;
  data: Map<string, PointPosition>;
}

declare interface GroupPositions {
  kind: `${GroupKind}s`;
  viewType: 'flat' | 'normal';
  dx: number;
  dy: number;
  data: Map<string, { start: PointPosition; end: PointPosition }>;
}
