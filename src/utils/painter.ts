import { DAYS, DELTA, GRID_SIZE, POS_ZANDIS, SPACING } from '~constants';

const DX = 2 * (GRID_SIZE + SPACING);
const DY = GRID_SIZE + SPACING;
const c = (l: number, u: number) =>
  Math.round(Math.random() * (u || 255) + l || 0);

const HEAD_H = 10; //노드 헤드 두께
const HEAD_MARGIN = 2; //노드 헤드 마진
const LINE_BOLD = 2;
const LINE_LIGHT = 1;
const BAR_H = 2;
const BAR_STEP = 6;

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

    var body_h = h - HEAD_H - HEAD_MARGIN;
    var head_s = HEAD_MARGIN + HEAD_H;

    //===================몸통부==================
    //몸통 맨위
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - body_h);
    ctx.lineTo(x, y - dy - body_h);
    ctx.lineTo(x + dx, y - body_h);
    ctx.lineTo(x, y + dy - body_h);
    ctx.fill();

    //몸통 바닥
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(x - dx, y);
    ctx.lineTo(x, y + dy);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x, y - dy);
    ctx.fill();

    //몸통 왼쪽
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - body_h);
    ctx.lineTo(x, y + dy - body_h);
    ctx.lineTo(x, y + dy);
    ctx.lineTo(x - dx, y);
    ctx.fill();

    //몸통 오른쪽
    ctx.fillStyle = '#453C9E';
    ctx.beginPath();
    ctx.lineTo(x, y + dy - body_h);
    ctx.lineTo(x + dx, y - body_h);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x, y + dy);
    ctx.fill();

    //================왼쪽몸통 BAR 부 ==========
    const count = (body_h - BAR_STEP) / (BAR_STEP + BAR_H);
    var ratio = 0.8;
    for (var i = 1; i < count + 1; i++) {
      ctx.fillStyle = '#453C9E';
      ctx.beginPath();
      ctx.moveTo(x - ratio * dx, y + (1 - ratio) * dy - i * BAR_STEP); //1
      ctx.lineTo(x - (1 - ratio) * dx, y + ratio * dy - i * BAR_STEP); //2
      ctx.lineTo(x - (1 - ratio) * dx, y + ratio * dy - i * BAR_STEP - BAR_H); //3
      ctx.lineTo(x - ratio * dx, y + (1 - ratio) * dy - i * BAR_STEP - BAR_H); //4
      ctx.fill();
    }

    //===================머리부==================
    //머리 맨위
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - body_h - head_s);
    ctx.lineTo(x, y - dy - body_h - head_s);
    ctx.lineTo(x + dx, y - body_h - head_s);
    ctx.lineTo(x, y + dy - body_h - head_s);
    ctx.fill();

    //머리 작은마름모
    ctx.fillStyle = '#453C9E';
    ctx.beginPath();
    ctx.moveTo(x - 0.75 * dx, y - body_h - head_s);
    ctx.lineTo(x, y - 0.75 * dy - body_h - head_s);
    ctx.lineTo(x + 0.75 * dx, y - body_h - head_s);
    ctx.lineTo(x, y + 0.75 * dy - body_h - head_s);
    ctx.fill();

    //머리 왼쪽
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - body_h - head_s);
    ctx.lineTo(x, y + dy - body_h - head_s);
    ctx.lineTo(x, y + dy - body_h - HEAD_MARGIN);
    ctx.lineTo(x - dx, y - body_h - HEAD_MARGIN);
    ctx.fill();

    // //머리 오른쪽
    ctx.fillStyle = '#453C9E';
    ctx.beginPath();
    ctx.lineTo(x, y + dy - body_h - head_s);
    ctx.lineTo(x + dx, y - body_h - head_s);
    ctx.lineTo(x + dx, y - body_h - HEAD_MARGIN);
    ctx.lineTo(x, y + dy - body_h - HEAD_MARGIN);
    ctx.fill();

    ////==================흰색 음영 띠들=====================
    //머리 맨위 하단의 흰색 빛
    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - body_h - head_s);
    ctx.lineTo(x, y + dy - body_h - head_s);
    ctx.lineTo(x + dx, y - body_h - head_s);
    ctx.stroke();

    //머리 작은마름모의 흰색 빛
    ctx.lineWidth = LINE_BOLD;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x - 0.75 * dx, y - body_h - head_s);
    ctx.lineTo(x, y - 0.75 * dy - body_h - head_s);
    ctx.lineTo(x + 0.75 * dx, y - body_h - head_s);
    ctx.stroke();

    //몸통 상단의 흰색 빛
    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x - dx, y - body_h);
    ctx.lineTo(x, y + dy - body_h);
    ctx.lineTo(x + dx, y - body_h);
    ctx.stroke();

    ctx.restore();
  },
];

/**
 * 파드 블럭을 렌더링합니다.
 * 타원 사용법: ellipse (x, y, radiusX, radiusY, rotation, startAngle, endAngle, 반 시계 방향)
 * @author 김민정
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
    var body_h = h - HEAD_H - HEAD_MARGIN;

    var lingrad = ctx.createLinearGradient(x - dx, y, x + dx, y);
    lingrad.addColorStop(0, '#A3E8E9');
    lingrad.addColorStop(1, '#009596');

    //=========================기둥부=================
    ctx.fillStyle = lingrad;
    ctx.beginPath();
    ctx.moveTo(x - dx, y);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x + dx, y - body_h);
    ctx.lineTo(x - dx, y - body_h);
    ctx.fill();

    // 바닥부
    ctx.fillStyle = lingrad;
    ctx.beginPath();
    ctx.ellipse(x, y, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();

    //몸통의 맨위
    ctx.fillStyle = '#08A8A9';
    ctx.beginPath();
    ctx.ellipse(x, y - body_h, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x, y - body_h, dx, dy, 0, 0, Math.PI * 2);
    ctx.stroke();

    // ======================머리부======================
    //ellipse (x, y, radiusX, radiusY, rotation, startAngle, endAngle, 반 시계 방향)

    // 머리의 몸통
    ctx.fillStyle = lingrad;
    ctx.beginPath();
    ctx.ellipse(x, y - h + HEAD_H, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = lingrad;
    ctx.beginPath();
    ctx.moveTo(x - dx, y - h);
    ctx.lineTo(x + dx, y - h);
    ctx.lineTo(x + dx, y - h + HEAD_H);
    ctx.lineTo(x - dx, y - h + HEAD_H);
    ctx.fill();

    //머리 큰 뚜껑
    ctx.fillStyle = '#B7E8E9';
    ctx.beginPath();
    ctx.ellipse(x, y - h, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();

    //머리 작은 뚜껑
    ctx.fillStyle = '#16BFC0';
    ctx.beginPath();
    ctx.ellipse(x, y - h, 0.75 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    ctx.fill();

    //===================흰색 음영 라인==================

    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x, y - h, 0.75 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x, y - h, dx, dy, 0, 0, Math.PI * 2);
    ctx.stroke();

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

export const paintLine: Painter.PaintArea = (ctx, x1, y1, x2, y2) => [
  () => {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
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

export const renderGrids: Painter.Render<LinePosition> = (
  ctx,
  currentRef,
  positions,
  selectedPosition,
  visible
) => {
  const stackPaintingObject: any[] = [];

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  if (visible) {
    positions.forEach((position) => {
      stackPaintingObject.push(
        ...paintLine(ctx, position.x1, position.y1, position.x2, position.y2)
      );
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, currentRef.width, currentRef.height);
    ctx.fillRect(0, 0, currentRef.width, currentRef.height);
    stackPaintingObject.forEach((paintObject) => paintObject());
  };

  render();
};

export const renderPoints: Painter.Render<PointPosition> = (
  ctx,
  currentRef,
  positions,
  selectedPosition,
  visible
) => {
  const stackPaintingObject: (() => void)[] = [];

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  if (visible) {
    positions.forEach((position) => {
      if (
        !!selectedPosition &&
        position.row === selectedPosition.row &&
        position.column === selectedPosition.column
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

export const renderObjects: Painter.Render<PointPosition> = (
  ctx,
  currentRef,
  positions,
  selectedPosition,
  visible,
  level
) => {
  const stackPaintingObject: any[] = [];
  const x0 = currentRef.width / 2 + 6 * DX;
  const y0 = currentRef.height / 4 + 6 * DY;
  const height = 15;

  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);

  positions.forEach((position) => {
    const paintObject = position.type === 'pod' ? paintPod : paintNode;
    const { DX, DY } = DELTA[level ?? 2];
    stackPaintingObject.push(
      ...paintObject(
        ctx,
        position.x,
        position.y,
        DX >> 1,
        DY >> 1,
        position.z ?? 35
      )
    );
  });

  const render = () => {
    ctx.clearRect(0, 0, currentRef.width, currentRef.height);
    ctx.fillRect(0, 0, currentRef.width, currentRef.height);
    stackPaintingObject.forEach((paint) => paint());

    // requestAnimationFrame(render);
  };

  render();
};
