declare namespace Positioner {
  type CanvasValue = Record<
    | 'DX'
    | 'DY'
    | 'A'
    | 'numRows'
    | 'numColumns'
    | 'x0'
    | 'y0'
    | 'row0'
    | 'column0',
    number
  >;
  type Pose = (resourceMap: Positioner.ResourceMap, level: 1 | 2 | 3) => void;

  type AdminResourceMap =
    | {
        type: 'admin';
        pods: Map<string, Resource.Pod>;
        nodes?: Map<string, Resource.Node>;
        clusters?: Map<string, Resource.Cluster>;
      }
    | {
        type: 'admin';
        pods?: never;
        nodes: Map<string, Resource.Pod>;
        clusters?: Map<string, Resource.Cluster>;
      };
  interface DeveloperResourceMap {
    type: 'dev';
    pods: Map<string, Resource.Pod>;
    deployments?: Map<string, Resource.Deployment>;
    namespaces?: Map<string, null>;
  }

  type ResourceMap<T = 'admin' | 'dev'> = T extends 'admin'
    ? AdminResourceMap
    : T extends 'dev'
    ? DeveloperResourceMap
    : never;

  interface Plot {
    blocks: Model<BlockPositions>;
    groups1: Model<GroupPositions> | null;
    groups2: Model<GroupPositions> | null;
  }

  type GetCursorPosition = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    cx: number,
    cy: number,
    perspective?: number,
    hitbox?: number
  ) => PointPosition | null;

  type GetCanvasValues = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => CanvasValue;

  type GetPointPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => PointPosition[];

  type GetHighlightedPointPosition = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    cx: number,
    cy: number
  ) => PointPosition | null;

  type GetLinePositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => LinePosition[];

  type GetPointPosition = (
    canvasValue: CanvasValue,
    matrix: PointMatrix | BlockMatrix,
    kind?: never,
    z?: never
  ) => PointPosition;

  type GetBlockPosition = (
    canvasValue: CanvasValue,
    matrix: BlockMatrix,
    kind: BlockKind,
    z?: number
  ) => BlockPosition;

  type GetBlockModels = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    matrixes: BlockMatrix[] | null,
    objectKind: BlockKind
  ) => Model<BlockPositions> | null;

  type GetGroupPosition = (
    canvasValue: CanvasValue,
    matrix: GroupMatrix,
    kind: GroupKind,
    z?: number
  ) => GroupPosition;

  type GetGroupModels = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    matrixes: GroupMatrix[] | null,
    objectKind: GroupKind
  ) => Model<GroupPositions> | null;

  type GetEndPointMatrix = (
    maxCol: number,
    blockLength: number
  ) => PointMatrix | null;

  type GetViewPositions<T extends 'admin' | 'dev'> = (
    resourceMap: ResourceMap<T>,
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => Plot;
}
