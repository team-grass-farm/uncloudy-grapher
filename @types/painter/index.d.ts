declare namespace Painter {
  type Option =
    | {
        text: string;
        color?: never;
        reversed?: never;
        selected?: never;
      }
    | {
        text?: never;
        color: string;
        reversed?: never;
        selected?: never;
      }
    | {
        text?: never;
        color?: never;
        reversed: boolean;
        selected?: never;
      }
    | {
        text?: never;
        color?: never;
        reversed?: never;
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

  type PaintCallback = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    h: number,
    option?: Option
  ) => () => void;
}
