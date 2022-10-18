declare namespace Painter {
  type ObjectName = 'block' | 'group1' | 'group2';
  type ObjectLayerName = 'blocks' | 'groups1' | 'groups2';
  type CalculatedLayerName = 'base' | 'stage' | 'cutton';
  type DebuggingLayerName = 'grid' | 'points';

  type Paint = (plot: Positioner.Plot) => void;
  type Option =
    | { text: string; selected?: never }
    | { text?: never; selected: boolean };

  interface Ref
    extends Record<
      ObjectLayerName | CalculatedLayerName | DebuggingLayerName,
      RefObject<HTMLCanvasElement>
    > {
    grid?: RefObject<HTMLCanvasElement>;
    points?: RefObject<HTMLCanvasElement>;
    event: RefObject<HTMLCanvasElement>;
  }
  interface Flag extends Partial<Record<DebuggingLayerName, boolean>> {}

  interface ObjectSnapshot extends Record<ObjectLayerName, ImageData | null> {}
  interface SubSnapshot extends Record<CalculatedLayerName, Image | null> {}

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

  type PaintObject = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    h: number,
    option?: Option
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
    option?: Option
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
  ) => void;

  type ClearRendered = (ctx: CanvasRenderingContext2D) => void;

  type Translate = (
    ctx: CanvasRenderingContext2D,
    snapshot: ImageData | null,
    perspective: number
  ) => void;

  type Render<
    T extends
      | PointPosition
      | PointPosition[]
      | LinePosition[]
      | BlockPosition
      | BlockPositions
      | GroupPositions
      | null
  > = (
    ctx: CanvasRenderingContext2D | null,
    positions: T,
    isBaseCanvas?: boolean
  ) => ImageData | null;
}
