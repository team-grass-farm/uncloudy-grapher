declare namespace Painter {
  type Value =
    | {
        text: string;
        color?: never;
        reversed?: never;
      }
    | {
        text?: never;
        color: string;
        reversed?: never;
      }
    | {
        text?: never;
        color?: never;
        reversed: boolean;
      };

  type PaintObject = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    h: number,
    value?: Value
  ) => (() => void)[];

  type PaintCallback = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    h: number,
    value?: Value
  ) => () => void;
}
