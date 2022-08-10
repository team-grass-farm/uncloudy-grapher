declare namespace Painter {
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

  type Render<T = PointPosition | LinePosition | GroupPosition> = (
    ctx: CanvasRenderingContext2D,
    currentRef: HTMLCanvasElement,
    positions: T[],
    visible: boolean,
    level?: 1 | 2 | 3,
    selectedPosition?: T | null
  ) => void;
}
