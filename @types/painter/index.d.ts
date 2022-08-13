declare namespace Painter {
  type Layer = 'blocks' | 'groups1' | 'groups2' | 'main';
  type Paint = (plot: Positioner.Plot) => void;
  type Option =
    | {
        text: string;
        color?: never;
        selected?: never;
      }
    | {
        text?: never;
        color: string;
        selected?: never;
      }
    | {
        text?: never;
        color?: never;
        selected: boolean;
      };

  interface RefMap extends Record<Layer, RefObject<HTMLCanvasElement>> {
    grid?: RefObject<HTMLCanvasElement>;
    points?: RefObject<HTMLCanvasElement>;
    event: RefObject<HTMLCanvasElement>;
  }
  interface FlagMap extends Record<Layer, boolean> {
    grid?: boolean;
    points?: boolean;
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

  type PaintArea = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
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

  type Render<
    T extends PointPosition[] | LinePosition[] | BlockPositions | GroupPositions
  > = (
    ctx: CanvasRenderingContext2D,
    currentRef: HTMLCanvasElement,
    positions: T,
    visible: boolean,
    selectedPosition?: SelectedPosition<T> | null
  ) => void;
}
