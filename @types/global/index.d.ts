declare type Dimensions = Record<'width' | 'height', number>;

declare type LineKind = 'grid';
declare type BlockKind = 'pod' | 'node';
declare type GroupKind = 'deployment' | 'namespace' | 'cluster' | 'node';

declare type Matrix = PointMatrix | BlockMatrix | GroupMatrix;
declare interface PointMatrix {
  id?: never;
  kind: 'point';
  row: number;
  column: number;
  depth?: never;
}

declare interface BlockMatrix {
  id: string;
  kind: BlockKind;
  row: number;
  column: number;
  depth?: number;
}

declare interface GroupMatrix {
  id: string;
  kind: GroupKind;
  start: PointMatrix;
  end: PointMatrix;
  depth?: number;
}

declare interface LinePosition {
  // TODO change type to kind
  type: LineKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

declare interface PointPosition extends PointMatrix {
  id?: never;
  kind: 'point';
  x: number;
  y: number;
  z?: never;
}

declare interface BlockPosition extends BlockMatrix {
  id: string;
  kind: BlockKind;
  x: number;
  y: number;
  z?: number;
}

declare interface BlockPositions extends Map<string, BlockPosition> {}

declare interface GroupPosition extends GroupMatrix {
  id: string;
  kind: GroupKind;
  start: PointPosition;
  end: PointPosition;
}

declare interface GroupPositions extends Map<string, GroupPosition> {}

declare interface Model<
  T extends BlockPosition | BlockPositions | GroupPosition | GroupPositions
> {
  objectKind: T extends BlockPosition | BlockPositions ? BlockKind : GroupKind;
  viewType: 'flat' | 'normal';
  dx: number;
  dy: number;
  dz?: number;
  zIndex?: number;
  data: T;
}

// declare interface BlockPosition {
//   id: string;
//   kind: BlockKind;
//   viewType: 'flat' | 'normal';
//   dx: number;
//   dy: number;
//   dz?: number;
//   data: PointPosition;
// }

// declare interface GroupPosition {
//   // id: string;
//   kind: GroupKind;
//   viewType: 'flat' | 'normal';
//   zIndex: number;
//   data: { start: PointPosition; end: PointPosition };
// }

// declare interface BlockPositions extends BlockPosition {
//   kind: `${BlockKind}s`;
//   viewType: 'flat' | 'normal';
//   dx: number;
//   dy: number;
//   dz?: number;
//   data: Map<string, PointPosition>;
// }

// declare interface GroupPositions {
//   kind: `${GroupKind}s`;
//   viewType: 'flat' | 'normal';
//   dx: number;
//   dy: number;
//   data: Map<string, { start: PointPosition; end: PointPosition }>;
// }
