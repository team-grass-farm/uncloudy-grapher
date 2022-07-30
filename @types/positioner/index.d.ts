declare namespace Positioner {
  interface SavedViews {
    admin: {
      pods?: Pod[];
      nodes?: Node[];
      clusters?: Cluster[];
    };

    developer: {
      pods?: Pod[];
      deployments?: Deployment[];
      namespaces?: string[];
    };
  }

  type GetCursorPosition = (
    cx: number,
    cy: number,
    level: 1 | 2 | 3,
    offsetX: number,
    offsetY: number
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

  type GetBlockPositions = (
    matrixes: Matrix[] | null,
    level: 1 | 2 | 3,
    type: PointType & ('node' | 'pod')
  ) => PointPosition[];

  type GetGroupPositions = (
    matrixes: [Matrix, Matrix][] | null,
    level: 1 | 2 | 3,
    type: GroupType
  ) => GroupPosition[];

  type GetDeveloperViewPositions = (
    level: 1 | 2 | 3,
    maxRow: number,
    canvasColumn: number,
    options: {
      showDeployments: boolean;
      showNamespaces: boolean;
    }
  ) => {
    pods: PointPosition[];
    deployments: GroupPosition[] | null;
    namesaces: GroupPoisition[] | null;
  };

  type GetAdminViewPositions = (
    level: 1 | 2 | 3,
    maxRow: number,
    canvasColumn: number,
    options: {
      showPods: boolean;
      showClusters: boolean;
    }
  ) => {
    pods: PointPosition[] | null;
    nodes: GroupPosition[] | PointPosition[];
    clusters: GroupPoisition[] | null;
  };
}
