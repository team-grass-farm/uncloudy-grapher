declare namespace Positioner {
  interface SavedViews {
    admin: {
      pods: Resource.Pod[];
      nodes: Resource.Node[];
      clusters: Resource.Cluster[];
    };
    developer: {
      pods: Resource.Pod[];
      deployments: Resource.Deployment[];
      namespaces: string[];
    };
  }

  interface PositionMap {
    block: PointPosition[];
    group1: GroupPosition[] | null;
    group2: GroupPosition[] | null;
  }

  type AddResource<T extends Resource.Pod | Resource.Node> = (
    data: Map<string, T>
  ) => void;

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
  ) => PointPosition[];

  type GetGroupPositions = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    matrixes: [Matrix, Matrix][] | null,
    type: GroupType
  ) => GroupPosition[];

  type GetViewPositions<T extends 'dev' | 'admin'> = (
    width: number,
    height: number,
    level: 1 | 2 | 3,
    options: T extends 'dev'
      ? {
          showDeployments: boolean;
          showNamespaces: boolean;
        }
      : {
          showPods: boolean;
          showClusters: boolean;
        }
  ) => PositionMap;
}
