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

  interface SavedView extends Record<ObjectName, any> {
    block: View<BlockPosition> | null;
    group1: View<GroupPosition> | null;
    group2: View<GroupPosition> | null;
  }

  interface SavedViews extends Record<ObjectLayerName, any> {
    blocks: View<BlockPosition | BlockPositions> | null;
    groups1: View<GroupPosition | GroupPositions> | null;
    groups2: View<GroupPosition | GroupPositions> | null;
  }

  interface SavedShrankViews
    extends Record<'curtain1' | 'curtain2' | 'pillar', Painter.SavedViews> {}

  type PaintBlock = (
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

  type PaintGroup = (
    ctx: CanvasRenderingContext2D,
    start: PointPosition,
    end: PointPosition,
    dx: number,
    dy: number,
    h: number,
    option?: GroupOption
  ) => (() => void)[];

  type PaintText = (
    ctx: CanvasRenderingContext2D,
    start: PointPosition,
    end: PointPosition,
    dx: nymber,
    dy: number,
    h: number,
    text: string
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
    clearCanvas: boolean
  ) => Promise<void>;

  type ClearRendered = (ctx: CanvasRenderingContext2D | null) => void;

  type Translate = (
    ctx: CanvasRenderingContext2D | null,
    snapshot: ImageData | null,
    perspective: number
  ) => void;

  type Render<T extends Position> = (
    ctx: CanvasRenderingContext2D | null,
    view: View<T> | null
  ) => ImageData | null;

  type QuickRender<T extends Position> = (
    ctx: CanvasRenderingContext2D,
    view: View<T> | null,
    backCtx?: CanvasRenderingContext2D | null
  ) => [ImageData | null, (() => void) | null];
}
