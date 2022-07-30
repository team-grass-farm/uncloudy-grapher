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
    maxRow: number,
    canvasColumn: number,
    options: T extends 'dev'
      ? {
          showDeployments: boolean;
          showNamespaces: boolean;
        }
      : {
          showPods: boolean;
          showClusters: boolean;
        }
  ) => {
    block: PointPosition[];
    group1: GroupPosition[] | null;
    group2: GroupPosition[] | null;
  };
}
