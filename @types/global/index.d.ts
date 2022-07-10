declare type ObjectType = 'pod' | 'node' | 'point';

declare interface Position {
  x: number;
  y: number;
  row: number;
  column: number;
  type: ObjectType;
}

declare interface SelectedPosition extends Position {}
