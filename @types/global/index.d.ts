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

declare type Position =
  | LinePosition
  | LinePositions
  | PointPosition
  | PointPositions
  | BlockPosition
  | BlockPositions
  | GroupPosition
  | GroupPositions;

declare interface LinePosition {
  kind: LineKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

declare interface LinePositions extends Map<string, LinePosition> {}

declare interface PointPosition extends PointMatrix {
  id?: never;
  kind: 'point';
  x: number;
  y: number;
  z?: never;
}

declare interface PointPositions extends Map<string, PointPosition> {}

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

type PositionKind<
  T extends BlockPosition | BlockPositions | GroupPosition | GroupPositions
> = T extends BlockPosition | BlockPositions ? BlockKind : GroupKind;

declare type View<T extends Position> = T extends
  | PointPosition
  | PointPositions
  | LinePosition
  | LinePositions
  ? T
  : {
      objectKind: PositionKind<T>;
      type: 'flat' | 'normal';
      dx: number;
      dy: number;
      dz?: number;
      zIndex?: number;
      data: T;
    };
