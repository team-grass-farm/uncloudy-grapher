import { DAYS, GRID_SIZE, POS_ZANDIS, SPACING } from '~constants';

const DX = 2 * (GRID_SIZE + SPACING);
const DY = GRID_SIZE + SPACING;
const c = (l: number, u: number) =>
  Math.round(Math.random() * (u || 255) + l || 0);

export const paintCube: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();
    ctx.translate(x, y);

    // center face
    ctx.beginPath();
    ctx.moveTo(dx, 0);
    ctx.lineTo(2 * dx, dy);
    ctx.lineTo(dx, 2 * dy);
    ctx.lineTo(0, dy);
    ctx.closePath();
    ctx.fillStyle = '#989865';
    ctx.strokeStyle = '#8e8e5e';
    ctx.stroke();
    ctx.fill();

    // left face
    ctx.beginPath();
    ctx.moveTo(0, dy);
    ctx.lineTo(dx, 2 * dy);
    ctx.lineTo(dx, 2 * dy + h);
    ctx.lineTo(0, dy + h);
    ctx.closePath();
    ctx.fillStyle = '#838357';
    ctx.strokeStyle = '#7a7a51';
    ctx.stroke();
    ctx.fill();

    // left face
    ctx.beginPath();
    ctx.moveTo(dx, 2 * dy);
    ctx.lineTo(2 * dx, dy);
    ctx.lineTo(2 * dx, dy + h);
    ctx.lineTo(dx, 2 * dy + h);
    ctx.closePath();
    ctx.fillStyle = '#6f6f49';
    ctx.strokeStyle = '#676744';
    ctx.stroke();
    ctx.fill();

    ctx.restore();
  },
];

/**
 * 노드 블럭을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x: 노드 블럭의 x 시작점
 * @param y: 노드 블럭의 y 시작점
 * @param dx: 노드 블럭의 x 크기
 * @param dy: 노드 블럭의 y 크기
 * @param h: 노드 블럭의 높이
 * @returns () => void
 */
export const paintNode: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    // 잔디부
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - h);
    ctx.lineTo(x, y - dy - h);
    ctx.lineTo(x + dx, y - h);
    ctx.lineTo(x, y + dy - h);
    ctx.fill();

    //높이부 왼쪽
    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - h);
    ctx.lineTo(x, y + dy - h);
    ctx.lineTo(x, y + dy);
    ctx.lineTo(x - dx, y);
    ctx.fill();

    //높이부 오른쪽
    ctx.fillStyle = '#964b00';
    ctx.beginPath();
    ctx.lineTo(x, y + dy - h);
    ctx.lineTo(x + dx, y - h);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x, y + dy);
    ctx.fill();

    // 바닥부
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.moveTo(x - dx, y);
    ctx.lineTo(x, y + dy);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x, y - dy);
    ctx.fill();
    ctx.restore();
  },
];

/**
 * 파드 블럭을 렌더링합니다.
 * @author 백명상
 * @param ctx: 캔버스 포인터
 * @param x: 파드 블럭의 x 시작점
 * @param y: 파드 블럭의 y 시작점
 * @param dx: 파드 블럭의 x 크기
 * @param dy: 파드 블럭의 y 크기
 * @param h: 파드 블럭의 높이
 * @returns () => void
 */
export const paintPod: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    // TODO 코드 작성

    ctx.restore();
  },
];

export const paintPoint: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();
    ctx.fillStyle = '#dd5555';
    const valX = !!dx ? dx : 1.5,
      valY = !!dy ? dy : 1.5;
    ctx.fillRect(x - valX, y - valY, 2 * valX, 2 * valY);
    ctx.restore();
  },
];

export const paintLine: Painter.PaintObject = (
  ctx,
  x,
  y,
  dx,
  dy,
  _,
  option
) => [
  () => {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (option && option.reversed ? -dx : dx), y + dy);
    ctx.strokeStyle = '#ddd';
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  },
];

export const paintGrasses: Painter.PaintObject = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  h: number
) => {
  const stack: (() => void)[] = [];
  const paintGrass: Painter.PaintCallback = (ctx, x, y, dx, dy, h) => {
    let t = 0;
    const tall = 4 * (Math.random() * 0.4 + 0.6) * h;
    const size = ((Math.random() * 0.4 + 0.6) * dx) / 4;
    const speed = Math.random() * 2;

    const color =
      'rgb(' + c(60, 10) + ',' + c(201, 50) + ',' + c(120, 50) + ')';

    return () => {
      const deviation = Math.cos(t / 50) * Math.min(t / 20, dx);
      t += speed;

      ctx.save();
      ctx.translate(x + dx, y + dy);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.lineTo(-size, 0);
      ctx.quadraticCurveTo(-size, -tall / 2, deviation, -tall);
      ctx.quadraticCurveTo(size, -tall / 2, size, 0);
      ctx.fill();
      ctx.restore();
    };
  };

  POS_ZANDIS[parseInt('' + Math.random() * 2, 10)].forEach((posZandi) => {
    console.log('pos: ', posZandi);
    stack.push(paintGrass(ctx, x + posZandi[0], y + posZandi[1], dx, dy, h));
  });

  return stack;
};

export const paintMonthText: Painter.PaintObject = (
  ctx,
  x,
  y,
  dx,
  dy,
  h,
  data
) => [
  () => {
    ctx.save();
    ctx.translate(x, y);
    ctx.textAlign = 'left';
    ctx.font = dx + 'px non-serif';
    ctx.fillStyle = 'rgb(40, 60, 50)';
    const cos = Math.cos(Math.PI / 6);
    const sin = Math.sin(Math.PI / 6);
    ctx.transform(1, 0.5, -1, 0.5, 0, 0);
    ctx.scale(1, 0.75);
    ctx.fillText(!!data ? data.text + '월' : '', dx, dy * 2);
    ctx.restore();
  },
];

export const paintDayText: Painter.PaintObject = (
  ctx,
  x,
  y,
  dx,
  dy,
  h,
  data
) => [
  () => {
    ctx.save();
    ctx.translate(x, y);
    ctx.textAlign = 'left';
    ctx.font = dx + 'px non-serif';
    ctx.fillStyle = 'rgb(40, 60, 50)';
    const cos = Math.cos(Math.PI / 6);
    const sin = Math.sin(Math.PI / 6);
    ctx.transform(1, 0.5, -1, 0.5, 0, 0);
    ctx.fillText(!!data ? data.text ?? '' : '', dx, dy * 2);
    ctx.restore();
  },
];

export const renderLegend = (
  ctx: CanvasRenderingContext2D,
  currentRef: HTMLCanvasElement,
  dataChunks: number[][],
  paintingType: ('day' | 'month')[]
) => {
  const stackPaintingObject: any[] = [];
  const length = dataChunks.length;
  const x0 = currentRef.width / 2 + 6 * DX;
  const y0 = currentRef.height / 4 + 6 * DY;
  const height = 15;
  const a = new Date(Date.now());
  const b = new Date(a.getFullYear() + '-01-01');

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  if (paintingType.includes('month')) {
    dataChunks.map((_, y) =>
      stackPaintingObject.push(
        ...paintMonthText(
          ctx,
          x0 - (-1 + y) * DX,
          y0 + (y + 1) * DY,
          2 * GRID_SIZE,
          GRID_SIZE,
          height,
          // NOTE this is teamorary state for a sample data.
          y % 4 === 0
            ? { text: '' + (a.getMonth() + 1 - parseInt('' + y / 4, 10)) }
            : undefined
        )
      )
    );
  }
  if (paintingType.includes('day')) {
    !!dataChunks[0] &&
      dataChunks[0].map((_, x) =>
        stackPaintingObject.push(
          ...paintDayText(
            ctx,
            x0 - (x + length) * DX,
            y0 + (length - x) * DY,
            2 * GRID_SIZE,
            GRID_SIZE,
            height,
            { text: DAYS[x] }
          )
        )
      );
  }

  const render = () => {
    ctx.clearRect(0, 0, currentRef.width, currentRef.height);
    ctx.fillRect(0, 0, currentRef.width, currentRef.height);
    stackPaintingObject.forEach((paintObject) => paintObject());
  };

  render();
};

export const renderGrids = (
  ctx: CanvasRenderingContext2D,
  currentRef: HTMLCanvasElement,
  visible: boolean
) => {
  const stackPaintingObject: any[] = [];
  const x0 = parseInt('' + (currentRef.width % DX), 10);

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  if (visible) {
    Array.from(Array(parseInt('' + currentRef.width / DX, 10) + 1).keys()).map(
      (px) => {
        stackPaintingObject.push(
          ...paintLine(
            ctx,
            x0 + 2 * DX * px,
            0,
            currentRef.height * 2,
            currentRef.height,
            0,
            { reversed: true }
          )
          // ...paintLine(
          //   ctx,
          //   x0 + 2 * DX * px,
          //   0,
          //   currentRef.height * 2,
          //   currentRef.height,
          //   0,
          //   { reversed: false }
          // )
        );
      }
    );
  }

  const render = () => {
    ctx.clearRect(0, 0, currentRef.width, currentRef.height);
    ctx.fillRect(0, 0, currentRef.width, currentRef.height);
    stackPaintingObject.forEach((paintObject) => paintObject());
  };

  render();
};

export const renderPoints = (
  ctx: CanvasRenderingContext2D,
  currentRef: HTMLCanvasElement,
  positions: Position[],
  boundedPosition: SelectedPosition | null,
  visible: boolean
) => {
  const stackPaintingObject: (() => void)[] = [];

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  if (visible) {
    positions.forEach((position) => {
      if (
        !!boundedPosition &&
        position.row === boundedPosition.row &&
        position.column === boundedPosition.column
      ) {
        stackPaintingObject.push(
          ...paintPoint(ctx, position.x, position.y, 5, 5, 0)
        );
      } else {
        stackPaintingObject.push(
          ...paintPoint(ctx, position.x, position.y, 0, 0, 0)
        );
      }
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, currentRef.width, currentRef.height);
    ctx.fillRect(0, 0, currentRef.width, currentRef.height);
    visible && stackPaintingObject.forEach((paintObject) => paintObject());
  };
  render();
};

export const renderObjects = (
  ctx: CanvasRenderingContext2D,
  currentRef: HTMLCanvasElement,
  dataChunks: number[][],
  paintingType: 'box' | 'grass' | 'node' | 'pod'
) => {
  const stackPaintingObject: any[] = [];
  const x0 = currentRef.width / 2 + 6 * DX;
  const y0 = currentRef.height / 4 + 6 * DY;
  const height = paintingType === 'box' ? 5 : paintingType === 'node' ? 35 : 15;

  let paintObject: Painter.PaintObject;
  switch (paintingType) {
    case 'box':
      paintObject = paintCube;
      break;
    case 'grass':
      paintObject = paintGrasses;
      break;
    case 'node':
      paintObject = paintNode;
      break;
    case 'pod':
      paintObject = paintPod;
      break;
  }

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  dataChunks.map((contributes, y) =>
    contributes.map((_, x) =>
      stackPaintingObject.push(
        ...paintObject(
          ctx,
          x0 - (x + y) * DX,
          y0 + (y - x) * DY,
          2 * GRID_SIZE,
          GRID_SIZE,
          height
        )
      )
    )
  );

  const render = () => {
    ctx.clearRect(0, 0, currentRef.width, currentRef.height);
    ctx.fillRect(0, 0, currentRef.width, currentRef.height);
    stackPaintingObject.forEach((paint) => paint());

    paintingType === 'grass' && requestAnimationFrame(render);
  };

  render();
};
