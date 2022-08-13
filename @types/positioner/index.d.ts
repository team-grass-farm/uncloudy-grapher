declare namespace Positioner {
  type Dimensions = Record<'width' | 'height', number>;
  type Pose = (resourceMap: Positioner.ResourceMap) => void;

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
    blocks: BlockPositions;
    groups1: GroupPositions | null;
    groups2: GroupPositions | null;
  }

  type GetCursorPosition = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    cx: number,
    cy: number,
    hitbox?: number
  ) => PointPosition | null;

  type GetCanvasValues = (
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => Record<
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
    canvasValues: {
      DX: number;
      DY: number;
      x0: number;
      y0: number;
      row0: number;
      column0: number;
    },
    matrix: Matrix,
    type: PointType,
    z?: number
  ) => PointPosition;

  type GetBlockPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    matrixes: Matrix[] | null,
    type: PointType & ('node' | 'pod')
  ) => BlockPositions | null;

  type GetGroupPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    matrixes: [Matrix, Matrix][] | null,
    type: GroupType
  ) => GroupPositions | null;

  type GetViewPositions<T extends 'dev' | 'admin'> = (
    resourceMap: ResourceMap<T>,
    width: number,
    height: number,
    level: 1 | 2 | 3
  ) => Plot;
}
