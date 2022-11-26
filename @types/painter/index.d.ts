declare namespace Painter {
  type ObjectName = 'block' | 'group1' | 'group2';
  type ObjectLayerName = 'blocks' | 'groups1' | 'groups2';
  type CalculatedLayerName = 'base' | 'stage' | 'cutton';
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

  interface Position extends Record<ObjectName, any> {
    matrix: Matrix | null;
    block: BlockPosition | null;
    group1: GroupPosition | null;
    group2: GroupPosition | null;
  }

  interface Positions extends Record<ObjectLayerName, any> {
    matrix: Matrix[] | null;
    blocks: BlockPositions | BlockPosition | null;
    groups1: GroupPosition[] | GroupPosition | null;
    groups2: GroupPosition[] | GroupPosition | null;
  }

  interface ShrankPositions
    extends Record<'cutton' | 'pillar', Painter.Positions> {}

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

  type ClearRendered = (ctx: CanvasRenderingContext2D) => void;

  type Translate = (
    ctx: CanvasRenderingContext2D | null,
    snapshot: ImageData | null,
    perspective: number
  ) => void;

  type RenderType =
    | PointPosition
    | PointPosition[]
    | LinePosition[]
    | BlockPosition
    | BlockPositions
    | GroupPositions
    | null;

  type Render<T extends RenderType> = (
    ctx: CanvasRenderingContext2D | null,
    positions: T
  ) => ImageData | null;

  type QuickRender<T extends RenderType> = (
    ctx: CanvasRenderingContext2D,
    positions: T,
    backCtx?: CanvasRenderingContext2D | null
  ) => Promise<[ImageData, () => void] | [null, null]>;
}
