declare namespace Painter {
  type ObjectName = 'block' | 'group1' | 'group2';
  type ObjectLayerName = 'blocks' | 'groups1' | 'groups2';
  type CalculatedLayerName = 'base' | 'stage' | 'curtain1' | 'curtain2';
  type DebuggingLayerName = 'grid' | 'points';

  type Paint = (plot: Positioner.Plot) => void;
  type Option = { selected?: boolean };
  type BlockOption = { renderTopHalfOnly?: boolean } & Option;
  type GroupOption = { text?: string } & Option;

  interface Layer<T extends any>
    extends Record<
      ObjectLayerName | CalculatedLayerName | DebuggingLayerName,
      T
    > {
    grid?: T;
    points?: T;
    event: T;
  }

  type Ref = Layer<RefObject<HTMLCanvasElement>>;
  type Context = Layer<CanvasRenderingContext2D | null>;

  interface Flag extends Partial<Record<DebuggingLayerName, boolean>> {}

  interface ObjectSnapshot extends Record<ObjectLayerName, ImageData | null> {}
  interface SubSnapshot
    extends Record<CalculatedLayerName, (() => void) | null> {}

  interface Model extends Record<ObjectName, any> {
    block: Model<BlockPosition> | null;
    group1: Model<GroupPosition> | null;
    group2: Model<GroupPosition> | null;
  }

  interface Models extends Record<ObjectLayerName, any> {
    blocks: Model<BlockPositions> | null;
    groups1: Model<GroupPositions> | null;
    groups2: Model<GroupPositions> | null;
  }

  interface ShrankModels
    extends Record<'curtain1' | 'curtain2' | 'pillar', Painter.Models> {}

  type PaintObject = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    h: number,
    option?: BlockOption
  ) => (() => void)[];

  type PaintLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    option?: Option
  ) => (() => void)[];

  type PaintArea = (
    ctx: CanvasRenderingContext2D,
    start: PointPosition,
    end: PointPosition,
    dx: number,
    dy: number,
    h: number,
    option?: GroupOption
  ) => (() => void)[];

  type PaintCallback = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    h: number,
    option?: Option
  ) => () => void;

  type SelectedPosition<T> = T extends GroupPositions
    ? GroupPosition
    : PointPosition;

  type BaseRender = (
    ctx: CanvasRenderingContext2D,
    stackPaintings: (() => void)[],
    clearCanvas: boolean,
    animated: boolean
  ) => Promise<void>;

  type ClearRendered = (ctx: CanvasRenderingContext2D | null) => void;

  type Translate = (
    ctx: CanvasRenderingContext2D | null,
    snapshot: ImageData | null,
    perspective: number
  ) => void;

  type Rendering =
    | PointPosition
    | PointPosition[]
    | LinePosition[]
    | Model<BlockPosition | BlockPositions | GroupPosition | GroupPositions>
    | null;

  type Render<T extends Rendering> = (
    ctx: CanvasRenderingContext2D | null,
    positions: T
  ) => ImageData | null;

  type QuickRender<T extends Rendering> = (
    ctx: CanvasRenderingContext2D,
    positions: T,
    backCtx?: CanvasRenderingContext2D | null
  ) => [ImageData | null, (() => void) | null];
}
