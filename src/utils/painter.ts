/**
 * @module painter
 */
import { DAYS, GRID_SIZE, POS_ZANDIS, SPACING } from '~constants';
import { report } from '~utils/logger';

const DX = 2 * (GRID_SIZE + SPACING);
const DY = GRID_SIZE + SPACING;
const DX_OBJ = DX * 0.45;
const DY_OBJ = DY * 0.45;
const c = (l: number, u: number) =>
  Math.round(Math.random() * (u || 255) + l || 0);

const HEAD_H = 5; //노드 헤드 두께
const HEAD_MARGIN = 2; //노드 헤드 마진
const LINE_BOLD = 2;
const LINE_LIGHT = 1;
const BAR_H = 2;
const BAR_STEP = 6;

const CLUSTER_H = 10;
const CLUSTER_X = 300;
const CLUSTER_Y = 300;
const CLUSTER_DX = 200;
const CLUSTER_DY = 100;

const NAMESAPCE_H = 10;
const NAMESPACE_X = 300;
const NAMESPACE_Y = 300;
const NAMESAPCE_DX = 200;
const NAMESAPCE_DY = 100;

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

export const paintFlatNode: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    ctx.fillStyle = '#16BFC0';
    ctx.beginPath();
    ctx.ellipse(x, y - h, 0.75 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
];

/**
 * 클러스터 그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param CLUSTER_X: 클러스터 그룹의 x 시작점
 * @param CLUSTER_Y: 클러스터 그룹의 y 시작점
 * @param CLUSTER_DX: 클러스터 그룹의 x 크기
 * @param CLUSTER_DY: 클러스터 그룹의 y 크기
 * @param CLUSTER_Y: 클러스터 그룹의 높이
 * @returns () => void
 */
export const paintCluster: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    //클러스터 맨위
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(CLUSTER_X - CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y - CLUSTER_DY - CLUSTER_H);
    ctx.lineTo(CLUSTER_X + CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY - CLUSTER_H);
    ctx.fill();

    //클러스터 바닥
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(CLUSTER_X - CLUSTER_DX, CLUSTER_Y);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY);
    ctx.lineTo(CLUSTER_X + CLUSTER_DX, CLUSTER_Y);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y - CLUSTER_DY);
    ctx.fill();

    //클러스터 왼쪽
    ctx.fillStyle = '#BCBEFF';
    ctx.beginPath();
    ctx.moveTo(CLUSTER_X - CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY);
    ctx.lineTo(CLUSTER_X - CLUSTER_DX, CLUSTER_Y);
    ctx.fill();

    //클러스터 오른쪽
    ctx.fillStyle = '#8E91E3';
    ctx.beginPath();
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY - CLUSTER_H);
    ctx.lineTo(CLUSTER_X + CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X + CLUSTER_DX, CLUSTER_Y);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY);
    ctx.fill();

    //클러스터 맨위 작은 마름모
    ctx.fillStyle = '#8C82F0';
    ctx.beginPath();
    ctx.moveTo(CLUSTER_X - 0.92 * CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y - 0.93 * CLUSTER_DY - CLUSTER_H);
    ctx.lineTo(CLUSTER_X + 0.92 * CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + 0.9 * CLUSTER_DY - CLUSTER_H);
    ctx.fill();

    //클러스터 상단의 흰색 빛
    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(CLUSTER_X - CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
    ctx.lineTo(CLUSTER_X, CLUSTER_Y + CLUSTER_DY - CLUSTER_H);
    ctx.lineTo(CLUSTER_X + CLUSTER_DX, CLUSTER_Y - CLUSTER_H);
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
export const paintPod: Painter.PaintObject = (ctx, x, y, dx, dy, h, option) => [
  () => {
    ctx.save();
    const body_h = h - HEAD_H - HEAD_MARGIN;
    const greyscale = option && option.selected === false;

    const lingrad = ctx.createLinearGradient(x - dx, y, x + dx, y);
    lingrad.addColorStop(0, greyscale ? '#EEEEEE' : '#A3E8E9');
    lingrad.addColorStop(1, greyscale ? '#999999' : '#009596');

    const whitegrad = ctx.createLinearGradient(x - dx, y, x + dx, y);
    whitegrad.addColorStop(0, '#DDDDDD');
    whitegrad.addColorStop(1, '#EFEFEF');

    if (!greyscale) {
      //=========================기둥부=================
      ctx.fillStyle = option && option.selected ? lingrad : whitegrad;
      ctx.beginPath();
      ctx.moveTo(x - dx, y);
      ctx.lineTo(x + dx, y);
      ctx.lineTo(x + dx, y - body_h);
      ctx.lineTo(x - dx, y - body_h);
      ctx.fill();

      // 바닥부
      ctx.fillStyle = option && option.selected ? lingrad : whitegrad;
      ctx.beginPath();
      ctx.ellipse(x, y, dx, dy, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    //몸통의 맨위
    ctx.fillStyle = greyscale ? '#AAAAAA' : '#08A8A9';
    ctx.beginPath();
    ctx.ellipse(x, y - body_h, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = '#FFFFFF';
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
    ctx.fillStyle = greyscale ? '#BBBBBB' : '#16BFC0';
    ctx.beginPath();
    ctx.ellipse(x, y - h, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();

    // //머리 작은 뚜껑
    // ctx.fillStyle = greyscale ? '#BBBBBB' : '#16BFC0';
    // ctx.beginPath();
    // ctx.ellipse(x, y - h, 0.75 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    // ctx.fill();

    //===================흰색 음영 라인==================

    // ctx.lineWidth = 0;
    // ctx.strokeStyle = greyscale ? '#BBBBBB' : '#16BFC0';
    // ctx.beginPath();
    // ctx.ellipse(x, y - h, 0.75 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    // ctx.stroke();

    // ctx.lineWidth = 0;
    // ctx.strokeStyle = greyscale ? '#BBBBBB' : '#16BFC0';
    // ctx.beginPath();
    // ctx.ellipse(x, y - h, dx, dy, 0, 0, Math.PI * 2);
    // ctx.stroke();

    ctx.restore();
  },
];

export const paintFlatPod: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    ctx.fillStyle = '#16BFC0';
    ctx.beginPath();
    ctx.ellipse(x, y, 0.75 * dx, 0.75 * dy, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
];

/**
 * 네임스페이스 그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param NAMESAPCE_X: 네임스페이스 그룹의 x 시작점
 * @param NAMESAPCE_Y: 네임스페이스 그룹의 y 시작점
 * @param NAMESAPCE_DX: 네임스페이스 그룹의 x 크기
 * @param NAMESAPCE_DY: 네임스페이스 그룹의 y 크기
 * @param NAMESAPCE_H: 네임스페이스 그룹의 높이
 * @returns () => void
 */
export const paintNamespace: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    //네임스페이스 맨위
    ctx.fillStyle = '#F3F4FF';
    ctx.beginPath();
    ctx.moveTo(NAMESPACE_X - NAMESAPCE_DX, NAMESPACE_Y - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y - NAMESAPCE_DY - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X + NAMESAPCE_DX, NAMESPACE_Y - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY - NAMESAPCE_H);
    ctx.fill();

    //네임스페이스 바닥
    ctx.fillStyle = '#F3F4FF';
    ctx.beginPath();
    ctx.moveTo(NAMESPACE_X - NAMESAPCE_DX, NAMESPACE_Y);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY);
    ctx.lineTo(NAMESPACE_X + NAMESAPCE_DX, NAMESPACE_Y);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y - NAMESAPCE_DY);
    ctx.fill();

    //네임스페이스 왼쪽
    ctx.fillStyle = '#DBDDFC';
    ctx.beginPath();
    ctx.moveTo(NAMESPACE_X - NAMESAPCE_DX, NAMESPACE_Y - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY);
    ctx.lineTo(NAMESPACE_X - NAMESAPCE_DX, NAMESPACE_Y);
    ctx.fill();

    //네임스페이스 오른쪽
    ctx.fillStyle = '#DBDDFC';
    ctx.beginPath();
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X + NAMESAPCE_DX, NAMESPACE_Y - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X + NAMESAPCE_DX, NAMESPACE_Y);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY);
    ctx.fill();

    //네임스페이스 상단의 흰색 빛
    ctx.lineWidth = LINE_BOLD;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(NAMESPACE_X - NAMESAPCE_DX, NAMESPACE_Y - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X, NAMESPACE_Y + NAMESAPCE_DY - NAMESAPCE_H);
    ctx.lineTo(NAMESPACE_X + NAMESAPCE_DX, NAMESPACE_Y - NAMESAPCE_H);
    ctx.stroke();

    ctx.restore();
  },
];

/**
 * 평면 네임스페이스 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 평면 네임스페이스  x1 시작점 (A)
 * @param y1: 평면 네임스페이스  y1 시작점 (A)
 * @param x2: 평면 네임스페이스  x2 시작점 (C)
 * @param y2: 평면 네임스페이스  y2 시작점 (C)
 * A     D
 * 
 * B     C
 
 * @returns () => void
 */
export const paintFlatNamespace: Painter.PaintArea = (ctx, x1, y1, x2, y2) => [
  () => {
    ctx.save();

    //네임스페이스 평면도
    ctx.fillStyle = '#F1F8FF';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.fill();

    //네임스페이스 겉 점선 스트로크
    ctx.strokeStyle = '#63AFFC';
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y1);
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
    report.log('Painter', ['pos: ', posZandi]);
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
  option
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
    ctx.fillText(!!option ? option.text + '월' : '', dx, dy * 2);
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
  option
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
    ctx.fillText(!!option ? option.text ?? '' : '', dx, dy * 2);
    ctx.restore();
  },
];

const render: Painter.BaseRender = (
  ctx,
  { width, height },
  stackPaintings,
  clearCanvas,
  animated
) => {
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
  ctx.scale(1, 1);
  if (clearCanvas) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
  }

  stackPaintings.forEach((paintObject) => paintObject());
  // animated && requestAnimationFrame(this);
};

/**
 * Render texts of legends of a graph
 * @deprecated
 * @param ctx
 * @param currentRef
 * @param dataChunks
 * @param paintingType
 */
export const renderLegend = (
  ctx: CanvasRenderingContext2D,
  currentRef: HTMLCanvasElement,
  dataChunks: number[][],
  paintingType: ('day' | 'month')[]
) => {
  const stackPaintings: (() => void)[] = [];
  const length = dataChunks.length;
  const x0 = currentRef.width / 2 + 6 * DX;
  const y0 = currentRef.height / 4 + 6 * DY;
  const height = 15;
  const a = new Date(Date.now());
  const b = new Date(a.getFullYear() + '-01-01');

  if (paintingType.includes('month')) {
    dataChunks.map((_, y) =>
      stackPaintings.push(
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
        stackPaintings.push(
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

  render(ctx, currentRef, stackPaintings, true, false);
};

export const renderGrids: Painter.Render<LinePosition[]> = (
  ctx,
  dimensions,
  positions
) => {
  const stackPaintings: (() => void)[] = [];

  positions.forEach((position) => {
    stackPaintings.push(
      ...paintLine(ctx, position.x1, position.y1, position.x2, position.y2)
    );
  });

  render(ctx, dimensions, stackPaintings, true, false);
};

export const renderPoints: Painter.Render<PointPosition[]> = (
  ctx,
  dimensions,
  positions
) => {
  const stackPaintings: (() => void)[] = [];

  positions.forEach(({ x, y }) => {
    stackPaintings.push(...paintPoint(ctx, x, y, 0, 0, 0));
  });

  render(ctx, dimensions, stackPaintings, true, false);
};

export const renderHighlightedPoints: Painter.Render<PointPosition[]> = (
  ctx,
  dimensions,
  positions
) => {
  const stackPaintings: (() => void)[] = [];

  positions.forEach(({ x, y }) => {
    stackPaintings.push(...paintPoint(ctx, x, y, 5, 5, 0));
  });

  render(ctx, dimensions, stackPaintings, true, true);
};

let lastSurface: ImageData | null;

export const renderBlocks: Painter.Render<BlockPositions> = (
  ctx,
  dimensions,
  positions,
  isBaseCanvas
) => {
  const stackPaintings: (() => void)[] = [];

  let paintObject: Painter.PaintObject | null = null;
  report.log('Painter', ['positions: ', positions]);
  switch (!!positions.data.length ? positions.data[0].type : null) {
    case 'pod':
      paintObject = positions.viewType === 'flat' ? paintFlatPod : paintPod;
      break;
    case 'node':
      paintObject = positions.viewType === 'flat' ? paintFlatNode : paintNode;
      break;
  }

  if (!!paintObject) {
    lastSurface = null;
    positions.data.forEach((position) => {
      stackPaintings.push(
        ...paintObject!(
          ctx,
          position.x,
          position.y,
          positions.dx * 0.45,
          positions.dy * 0.45,
          position.z ? (positions.dz ?? 1) * position.z : 35,
          isBaseCanvas ? { selected: true } : undefined
        )
      );
    });
  }

  render(ctx, dimensions, stackPaintings, true, false);
};

export const renderHighlightedBlocks: Painter.Render<BlockPositions | null> = (
  ctx,
  dimensions,
  positions
) => {
  const stackPaintings: (() => void)[] = [];

  if (positions === null) {
    return;
  }

  let paintBlock: Painter.PaintObject | null = null;
  switch (!!positions.data.length ? positions[0].type : null) {
    case 'pod':
      paintBlock = positions.viewType === 'flat' ? paintFlatPod : paintPod;
      break;
    case 'node':
      paintBlock = positions.viewType === 'flat' ? paintFlatNode : paintNode;
      break;
  }

  !!lastSurface &&
    ctx.putImageData(lastSurface, dimensions.width, dimensions.height);

  positions.data.forEach((position) => {
    stackPaintings.push(
      ...paintBlock!(
        ctx,
        position.x,
        position.y,
        positions.dx,
        positions.dy,
        position.z ? (positions.dz ?? 35) * position.z : 35,
        { selected: true }
      )
    );
  });

  render(ctx, dimensions, stackPaintings, false, false);
};

export const renderGroups: Painter.Render<GroupPositions> = (
  ctx,
  dimensions,
  positions
) => {
  const stackPaintings: (() => void)[] = [];

  // positions.forEach((position) => {});

  // stackPaintings.push(...paintNamespace(ctx, 100, 100, 200, 200));

  render(ctx, dimensions, stackPaintings, true, false);
};

export const clearRendered: Painter.ClearRendered = (ctx, dimensions) => {
  render(ctx, dimensions, [], true, false);
};
