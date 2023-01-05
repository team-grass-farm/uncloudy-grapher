/**
 * @module painter
 */
import { DAYS, GRID_SIZE, POS_ZANDIS, SPACING } from '~constants';
import { report } from '~utils/logger';
import { isSingleBlockPosition } from '~utils/typeChecker';

const DX = 2 * (GRID_SIZE + SPACING);
const DY = GRID_SIZE + SPACING;
const DX_OBJ = DX * 0.45;
const DY_OBJ = DY * 0.45;
const c = (l: number, u: number) =>
  Math.round(Math.random() * (u || 255) + l || 0);

const HEAD_H = 2; //노드 헤드 두께
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

const NAMESPACE_NM = 'Namespace';

const CLUSTER_NM = 'Cluster';

const NODEGROUP_NM = 'Node Group';
const NODEGROUP_H = 10;

const DEPLOYMENTGROUP_NM = 'Deployment Group';
const DEPLOYMENTGROUP_H = 5;

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
 * 노드그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 노드그룹의 x1 시작점 (A)
 * @param y1: 노드그룹의 y1 시작점 (A)
 * @param x2: 노드그룹의 x2 시작점 (C)
 * @param y2: 노드그룹의 y2 시작점 (C)
 *      B
 * A        C
 *      D
 * @returns () => void
 */
export const paintNodeGroup: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    // var ratioY = (x2 - x1) / 4;

    // //===================노드그룹박스==================
    // ctx.fillStyle = '#BCBEFF';
    // ctx.beginPath();
    // ctx.moveTo(x1, y1 - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 - ratioY - NODEGROUP_H);
    // ctx.lineTo(x2, y2 - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY - NODEGROUP_H);
    // ctx.fill();

    // //노드그룹 바닥
    // ctx.fillStyle = '#BCBEFF';
    // ctx.beginPath();
    // ctx.moveTo(x1, y1);
    // ctx.lineTo((x1 + x2) / 2, y1 - ratioY);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.fill();

    // //노드그룹 왼쪽
    // ctx.fillStyle = '#BCBEFF';
    // ctx.beginPath();
    // ctx.moveTo(x1, y1 - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.lineTo(x1, y1);
    // ctx.fill();

    // // //노드그룹 오른쪽
    // ctx.fillStyle = '#8E91E3';
    // ctx.beginPath();
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY - NODEGROUP_H);
    // ctx.lineTo(x2, y2 - NODEGROUP_H);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.fill();

    // // //노드그룹 맨위 작은 네모
    // ctx.fillStyle = '#F1EDFE';
    // ctx.beginPath();
    // ctx.moveTo(x1 + (x2 - x1) / 20, y1 - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 - (x2 - x1) / 4.5 - NODEGROUP_H);
    // ctx.lineTo(x2 - (x2 - x1) / 20, y2 - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 + (x2 - x1) / 4.5 - NODEGROUP_H);
    // ctx.fill();

    // //노드그룹 상단의 흰색 빛
    // ctx.lineWidth = LINE_LIGHT;
    // ctx.strokeStyle = 'white';
    // ctx.beginPath();
    // ctx.moveTo(x1, y1 - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY - NODEGROUP_H);
    // ctx.lineTo(x2, y2 - NODEGROUP_H);
    // ctx.stroke();

    // //노드그룹 상단의 흰색 빛
    // ctx.lineWidth = LINE_LIGHT;
    // ctx.strokeStyle = 'white';
    // ctx.beginPath();
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY - NODEGROUP_H);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.stroke();

    // //노드그룹 이름 텍스트
    // ctx.translate((x1 + x2) / 2, y1 * 2);
    // ctx.rotate(-Math.PI / 7);
    // ctx.font = '20px Roboto';
    // ctx.fillStyle = '#B69FFA';
    // ctx.textAlign = 'left';
    // ctx.fillText(NODEGROUP_NM, 0, 0);

    ctx.restore();
  },
];

/**
 * 클러스터 그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 클러스터 그룹의 x1 시작점 (A)
 * @param y1: 클러스터 그룹의 y1 시작점 (A)
 * @param x2: 클러스터 그룹의 x2 시작점 (C)
 * @param y2: 클러스터 그룹의 y2 시작점 (C)
 *      B
 * A        C
 *      D
 * @returns () => void
 */
export const paintCluster: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    // var ratioY = (x2 - x1) / 4;

    // //클러스터
    // ctx.fillStyle = '#F1F3FD';
    // ctx.beginPath();
    // ctx.moveTo(x1, y1);
    // ctx.lineTo((x1 + x2) / 2, y1 - ratioY);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.fill();

    // //클러스터 겉 점선 스트로크
    // ctx.strokeStyle = '#A5A5A5';
    // ctx.beginPath();
    // ctx.setLineDash([3, 3]);
    // ctx.moveTo(x1, y1);
    // ctx.lineTo((x1 + x2) / 2, y1 - ratioY);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.lineTo(x1, y1);
    // ctx.stroke();

    // //클러스터 이름 텍스트
    // ctx.translate((x1 + x2) / 2, y1 * 2);
    // ctx.rotate(-Math.PI / 7);
    // ctx.font = '20px Roboto';
    // ctx.fillStyle = 'black';
    // ctx.textAlign = 'left';
    // ctx.fillText(CLUSTER_NM, 0, 0);

    ctx.restore();
  },
];

/**
 * 파드 블럭을 렌더링합니다.
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
    // 20 < body_h < 40
    const body_h = h - HEAD_H - HEAD_MARGIN;
    const level = parseInt('' + (40 - body_h), 10);
    const greyscale = option && option.selected === false;

    const lingrad = ctx.createLinearGradient(x - dx, y, x + dx, y);
    lingrad.addColorStop(
      0,
      greyscale
        ? '#EEEEEE'
        : `rgb(${163 - level}, ${232 - level}, ${233 - level})`
    );
    lingrad.addColorStop(
      1,
      greyscale ? '#999999' : `rgb(0, ${149 - level}, ${150 - level})`
    );

    const whitegrad = ctx.createLinearGradient(x - dx, y, x + dx, y);
    whitegrad.addColorStop(0, '#DDDDDD');
    whitegrad.addColorStop(1, '#EFEFEF');

    if (!greyscale) {
      // 기둥부
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
    // rgb(7, 93, 94)
    // console.log('body_h: ', body_h);
    ctx.fillStyle = greyscale
      ? '#BBBBBB'
      : `rgb(${10 + (level >> 2)}, ${191 - level * 3}, ${192 - level * 3})`;
    ctx.beginPath();
    ctx.ellipse(x, y - h, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
];

/**
 * @deprecated
 */
export const paintAnimatedPod: Painter.PaintObject = (
  ctx,
  x,
  y,
  dx,
  dy,
  h,
  option
) => {
  const ret: (() => void)[] = [];

  for (let currentHeight = h; currentHeight > HEAD_H; --currentHeight) {
    ret.push(...paintPod(ctx, x, y, dx, dy, currentHeight, option));
  }
  return ret;
};

/**
 *
 * @param ctx
 * @param start
 * @param end
 * @param dx
 * @param dy
 * @param h
 * @param option
 * @returns {void}
 */
export const paintGroup: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    const row = end.row - start.row;
    const column = end.column - start.column;
    const top = { x: start.x + row * dx, y: start.y - row * dy };
    const bottom = { x: start.x + column * dx, y: start.y + column * dy };

    const dx4 = dx >> 2,
      dy4 = dy >> 2,
      dx8 = dx >> 3,
      dy16 = dy >> 4;

    const lingrad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    lingrad.addColorStop(0, '#FFD5A5');
    lingrad.addColorStop(1, '#FFE5B5');

    ctx.fillStyle = '#FFD5A5';
    ctx.beginPath();
    ctx.moveTo(start.x - dx + dx8, start.y);
    ctx.lineTo(start.x - dx + dx8, start.y + h);
    ctx.quadraticCurveTo(
      start.x - dx + dx8,
      start.y + dy16 + h,
      start.x - dx + dx4,
      start.y + dy4 + h
    );
    ctx.lineTo(bottom.x - dx4, bottom.y + dy - dy4 + h);
    ctx.quadraticCurveTo(
      bottom.x,
      bottom.y + dy + h,
      bottom.x + dx4,
      bottom.y + dy - dy4 + h
    );
    ctx.lineTo(end.x + dx - dx4, end.y + dy4 + h);
    ctx.quadraticCurveTo(
      end.x + dx - dx8,
      end.y + dy16 + h,
      end.x + dx - dx8,
      end.y + h
    );
    ctx.lineTo(end.x + dx - dx8, end.y);
    ctx.fill();

    //디플로이먼트그룹 바닥
    ctx.fillStyle = '#FDF7E0';
    ctx.beginPath();
    ctx.moveTo(start.x - dx + dx4, start.y + dy4);
    ctx.lineTo(bottom.x - dx4, bottom.y + dy - dy4);
    ctx.quadraticCurveTo(
      bottom.x,
      bottom.y + dy,
      bottom.x + dx4,
      bottom.y + dy - dy4
    );
    ctx.lineTo(end.x + dx - dx4, end.y + dy4);
    ctx.quadraticCurveTo(end.x + dx, end.y, end.x + dx - dx4, end.y - dy4);
    ctx.lineTo(top.x, top.y - dy);
    ctx.lineTo(start.x - dx + dx4, start.y - dy4);
    ctx.quadraticCurveTo(
      start.x - dx,
      start.y,
      start.x - dx + dx4,
      start.y + dy4
    );

    ctx.fill();

    ctx.restore();
  },
];

export const paintFlatPod: Painter.PaintObject = (ctx, x, y, dx, dy, h) => [
  () => {
    ctx.save();

    ctx.fillStyle = '#B7E8E9';
    ctx.beginPath();
    ctx.ellipse(x, y, dx, dy, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16BFC0';
    ctx.beginPath();
    ctx.ellipse(x, y, 0.6 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    ctx.fill();

    //===================흰색 음영 라인==================

    ctx.lineWidth = LINE_LIGHT;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x, y, 0.6 * dx, 0.6 * dy, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  },
];

/**
 * 네임스페이스 그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 네임스페이스 그룹의 x1 시작점 (A)
 * @param y1: 네임스페이스 그룹의 y1 시작점 (A)
 * @param x2: 네임스페이스 그룹의 x2 시작점 (C)
 * @param y2: 네임스페이스 그룹의 y2 시작점 (C)
 *      B
 * A         C
 *      D
 * @returns () => void
 */
export const paintNamespace: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    // var ratioY = (x2 - x1) / 4;

    // //네임스페이스
    // ctx.fillStyle = '#F1F8FF';
    // ctx.beginPath();
    // ctx.moveTo(x1, y1);
    // ctx.lineTo((x1 + x2) / 2, y1 - ratioY);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.fill();

    // //네임스페이스 겉 점선 스트로크
    // ctx.strokeStyle = '#63AFFC';
    // ctx.beginPath();
    // ctx.setLineDash([3, 3]);
    // ctx.moveTo(x1, y1);
    // ctx.lineTo((x1 + x2) / 2, y1 - ratioY);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo((x1 + x2) / 2, y1 + ratioY);
    // ctx.lineTo(x1, y1);
    // ctx.stroke();

    // //네임스페이스 이름 텍스트
    // ctx.translate((x1 + x2) / 2, y1 * 2);
    // ctx.rotate(-Math.PI / 7);
    // ctx.font = '20px Roboto';
    // ctx.fillStyle = 'black';
    // ctx.textAlign = 'left';
    // ctx.fillText(NAMESPACE_NM, 0, 0);

    ctx.restore();
  },
];

/**
 * 평면 디플로이먼트그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 평면 디플로이먼트그룹  x1 시작점 (A)
 * @param y1: 평면 디플로이먼트그룹  y1 시작점 (A)
 * @param x2: 평면 디플로이먼트그룹  x2 시작점 (C)
 * @param y2: 평면 디플로이먼트그룹  y2 시작점 (C)
 * A     D
 * 
 * B     C
 
 * @returns () => void
 */
export const paintFlatDeploymentGroup: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    //디플로이먼트 그룹 평면도
    ctx.fillStyle = '#E3F1FF';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.fill();

    ctx.restore();
  },
];

/**
 * 평면 노드그룹을 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 평면 노드그룹  x1 시작점 (A)
 * @param y1: 평면 노드그룹  y1 시작점 (A)
 * @param x2: 평면 노드그룹  x2 시작점 (C)
 * @param y2: 평면 노드그룹  y2 시작점 (C)
 * A     D
 * 
 * B     C
 
 * @returns () => void
 */
export const paintFlatNodeGroup: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    //노드그룹 평면도
    ctx.fillStyle = '#F1EDFE';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.fill();

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
export const paintFlatNamespace: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    //네임스페이스 평면도
    ctx.fillStyle = '#F1F8FF';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.fill();

    //네임스페이스 겉 점선 스트로크
    ctx.strokeStyle = '#63AFFC';
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(start.x, start.x);
    ctx.lineTo(end.x, start.x);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.lineTo(start.x, start.x);
    ctx.stroke();

    ctx.restore();
  },
];

/**
 * 평면 클러스터 렌더링합니다.
 * @author 김민정
 * @param ctx: 캔버스 포인터
 * @param x1: 평면 클러스터  x1 시작점 (A)
 * @param y1: 평면 클러스터  y1 시작점 (A)
 * @param x2: 평면 클러스터  x2 시작점 (C)
 * @param y2: 평면 클러스터  y2 시작점 (C)
 * A     D
 * 
 * B     C
 
 * @returns () => void
 */
export const paintFlatCluster: Painter.PaintArea = (
  ctx,
  start,
  end,
  dx,
  dy,
  h,
  option
) => [
  () => {
    ctx.save();

    ctx.fillStyle = '#F1F3FD';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.fill();

    //클러스터 겉 점선 스트로크
    ctx.strokeStyle = '#A5A5A5';
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.lineTo(start.x, start.y);
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

export const paintLine: Painter.PaintLine = (ctx, x1, y1, x2, y2) => [
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
    report.log('Painter', { msg: 'pos on paintGresses()', posZandi });
    stack.push(paintGrass(ctx, x + posZandi[0], y + posZandi[1], dx, dy, h));
  });

  return stack;
};

/**
 * @deprecated
 */
// export const paintMonthText: Painter.PaintObject = (
//   ctx,
//   x,
//   y,
//   dx,
//   dy,
//   h,
//   option
// ) => [
//   () => {
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.textAlign = 'left';
//     ctx.font = dx + 'px non-serif';
//     ctx.fillStyle = 'rgb(40, 60, 50)';
//     const cos = Math.cos(Math.PI / 6);
//     const sin = Math.sin(Math.PI / 6);
//     ctx.transform(1, 0.5, -1, 0.5, 0, 0);
//     ctx.scale(1, 0.75);
//     ctx.fillText(!!option ? option.text + '월' : '', dx, dy * 2);
//     ctx.restore();
//   },
// ];

/**
 * @deprecated
 */
// export const paintDayText: Painter.PaintObject = (
//   ctx,
//   x,
//   y,
//   dx,
//   dy,
//   h,
//   option
// ) => [
//   () => {
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.textAlign = 'left';
//     ctx.font = dx + 'px non-serif';
//     ctx.fillStyle = 'rgb(40, 60, 50)';
//     const cos = Math.cos(Math.PI / 6);
//     const sin = Math.sin(Math.PI / 6);
//     ctx.transform(1, 0.5, -1, 0.5, 0, 0);
//     ctx.fillText(!!option ? option.text ?? '' : '', dx, dy * 2);
//     ctx.restore();
//   },
// ];

const render: Painter.BaseRender = async (
  ctx,
  stackPaintings,
  clearCanvas,
  animated
) =>
  await (() => {
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'transparent';
    ctx.scale(1, 1);
    if (clearCanvas) {
      ctx.clearRect(
        0,
        ctx.canvas.height >> 1,
        ctx.canvas.width >> 1,
        ctx.canvas.height
      );
      // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    report.debug('Painter', { msg: 'onRender()', stackPaintings });
    stackPaintings.forEach((paintObject) => {
      paintObject();
    });
  })();

const renderAnimated: Painter.BaseRender = (
  ctx,
  stackPaintings,
  clearCanvas,
  animated
) =>
  new Promise((resolve) => {
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'transparent';
    ctx.scale(1, 1);

    if (clearCanvas) {
      ctx.clearRect(
        0,
        ctx.canvas.height >> 1,
        ctx.canvas.width >> 1,
        ctx.canvas.height
      );
    }

    if (!!!stackPaintings.length) {
      report.debug(
        'Painter',
        { msg: 'renderAnimated (nope)', stackPaintings },
        { listening: ['stackPaintings'] }
      );
      resolve();
    } else {
      const frames = stackPaintings.entries();
      const runner = setInterval(() => {
        const frame = frames.next();
        if (!!!frame) {
        } else if (frame.done) {
          clearInterval(runner);
          report.debug('Painter', {
            msg: 'renderAnimated (done)',
            stackPaintings,
          });
          resolve();
        } else {
          if (clearCanvas) {
            ctx.clearRect(
              0,
              ctx.canvas.height >> 1,
              ctx.canvas.width >> 1,
              ctx.canvas.height
            );
          }
          requestAnimationFrame(frame.value[1]);
        }
      }, 10);
    }
  });

/**
 * Render texts of legends of a graph
 * @deprecated
 * @param ctx
 * @param dataChunks
 * @param paintingType
 */
export const renderLegend = (
  ctx: CanvasRenderingContext2D,
  dataChunks: number[][],
  paintingType: ('day' | 'month')[]
) => {
  const stackPaintings: (() => void)[] = [];
  const length = dataChunks.length;
  const x0 = ctx.canvas.width / 2 + 6 * DX;
  const y0 = ctx.canvas.height / 4 + 6 * DY;
  const height = 15;
  const a = new Date(Date.now());
  const b = new Date(a.getFullYear() + '-01-01');

  if (paintingType.includes('month')) {
    dataChunks.map((_, y) =>
      stackPaintings
        .push
        // ...paintMonthText(
        //   ctx,
        //   x0 - (-1 + y) * DX,
        //   y0 + (y + 1) * DY,
        //   2 * GRID_SIZE,
        //   GRID_SIZE,
        //   height,
        //   // NOTE this is teamorary state for a sample data.
        //   y % 4 === 0
        //     ? { text: '' + (a.getMonth() + 1 - parseInt('' + y / 4, 10)) }
        //     : undefined
        // )
        ()
    );
  }
  if (paintingType.includes('day')) {
    // !!dataChunks[0] &&
    //   dataChunks[0].map((_, x) =>
    //     stackPaintings.push(
    //       ...paintDayText(
    //         ctx,
    //         x0 - (x + length) * DX,
    //         y0 + (length - x) * DY,
    //         2 * GRID_SIZE,
    //         GRID_SIZE,
    //         height,
    //         { text: DAYS[x] }
    //       )
    //     )
    //   );
  }

  render(ctx, stackPaintings, true, false);
};

export const renderGrids: Painter.Render<LinePosition[]> = (ctx, positions) => {
  if (!!!ctx) return null;
  report.groupCollapsed('Painter', 'renderGrids()');
  const stackPaintings: (() => void)[] = [];

  positions.forEach((position) => {
    stackPaintings.push(
      ...paintLine(ctx, position.x1, position.y1, position.x2, position.y2)
    );
  });

  render(ctx, stackPaintings, true, false);
  report.groupEnd();
  return null;
};

export const renderPoints: Painter.Render<PointPosition[]> = (
  ctx,
  positions
) => {
  if (!!!ctx) return null;
  report.groupCollapsed('Painter', 'renderPoints()');
  const stackPaintings: (() => void)[] = [];

  positions.forEach(({ x, y }) => {
    stackPaintings.push(...paintPoint(ctx, x, y, 0, 0, 0));
  });

  render(ctx, stackPaintings, true, false);
  report.groupEnd();
  return null;
};

export const renderHoveredPoint: Painter.Render<PointPosition | null> = (
  ctx,
  position
) => {
  if (!!!ctx || !!!position) return null;
  report.groupCollapsed('Painter', 'renderHoveredPoint()');
  const stackPaintings: (() => void)[] = [];

  stackPaintings.push(...paintPoint(ctx, position.x, position.y, 5, 5, 0));

  render(ctx, stackPaintings, true, true);
  report.groupEnd();
  return null;
};

let lastSurface: ImageData | null;

export const renderBlocks: Painter.Render<
  BlockPosition | BlockPositions | null
> = (ctx, positions) => {
  if (!!!ctx) return null;
  report.groupCollapsed('Painter', 'renderBlocks()');

  const stackPaintings: (() => void)[] = [];

  if (!!positions) {
    let paintBlock: Painter.PaintObject | null = null;

    report.log('Painter', {
      msg: 'block positions on renderBlocks()',
      positions,
    });

    switch (positions.kind) {
      case 'pod':
      case 'pods':
        paintBlock = positions.viewType === 'flat' ? paintFlatPod : paintPod;
        break;
      case 'node':
      case 'nodes':
        paintBlock = positions.viewType === 'flat' ? paintFlatNode : paintNode;
        break;
    }

    if (!!paintBlock) {
      lastSurface = null;
      if (isSingleBlockPosition(positions)) {
        stackPaintings.push(
          ...paintBlock!(
            ctx,
            positions.data.x,
            positions.data.y,
            positions.dx * 0.45,
            positions.dy * 0.45,
            positions.data.z ? (positions.dz ?? 1) * positions.data.z : 35
          )
        );
      } else {
        positions.data.forEach((position) => {
          stackPaintings.push(
            ...paintBlock!(
              ctx,
              position.x,
              position.y,
              positions.dx * 0.45,
              positions.dy * 0.45,
              position.z ? (positions.dz ?? 1) * position.z : 35
            )
          );
        });
      }
    }
  }

  render(ctx, stackPaintings, true, true);
  report.groupEnd();
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const renderHoveredBlock: Painter.QuickRender<BlockPosition | null> = (
  ctx,
  position
) => {
  if (!!!ctx) return [null, null];
  report.groupCollapsed('Painter', 'renderHoveredBlock()');

  const stackPaintings: (() => void)[] = [];

  let paintBlock: Painter.PaintObject | null = null;

  if (!!position) {
    report.log('Painter', {
      msg: 'position on renderHoveredBlock()',
      position,
    });

    switch (position.kind) {
      case 'pod':
        paintBlock = position?.viewType === 'flat' ? paintFlatPod : paintPod;
        break;
      case 'node':
        paintBlock = position?.viewType === 'flat' ? paintFlatNode : paintNode;
        break;
    }

    stackPaintings.push(
      ...paintBlock!(
        ctx,
        position.data.x,
        position.data.y,
        position.dx * 0.45,
        position.dy * 0.45,
        position.data.z ? (position.dz ?? 1) * position.data.z : 35,
        { selected: true }
      )
    );
  }

  report.log('Painter', { msg: 'renderAnimated (Hovered)' });

  renderAnimated(ctx, stackPaintings, true, true);
  report.groupEnd();

  return [
    ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    () => {},
  ];
};

export const renderShrinkingBlocks: Painter.QuickRender<
  BlockPosition | BlockPositions | null
> = (ctx, positions, backCtx) => {
  if (!!!ctx) return [null, null];
  report.groupCollapsed('Painter', 'renderShrinkingBlock()');

  let backImageData: ImageData | null = null;
  let backRect: [number, number, number, number] | null = null;

  const stackPaintings: (() => void)[] = [];

  let paintBlock: Painter.PaintObject | null = null;

  if (!!positions) {
    if (isSingleBlockPosition(positions)) {
      // stackPaintings.push(
      //   ...paintAnimatedPod(
      //     ctx,
      //     positions.data.x,
      //     positions.data.y,
      //     positions.dx * 0.45,
      //     positions.dy * 0.45,
      //     positions.data.z ? (positions.dz ?? 1) * positions.data.z : 35,
      //     { selected: true }
      //   )
      // );
    } else {
      const { dx, dy, dz } = positions;
      positions.data.forEach((position) => {
        report.debug('Painter', {
          msg: 'shrinking',
          row: position.row,
          column: position.column,
          position,
        });

        if (!!backCtx) {
          backRect = [position.x - (dx >> 1), position.y - dy * 3, dx, 3 * dy];
          backImageData = backCtx.getImageData(...backRect);
          backCtx.clearRect(...(backRect as [number, number, number, number]));
          report.debug('Painter', {
            msg: 'shrinking',
            backCtx,
            backImageData,
          });
        }

        const height = position.z ? (dz ?? 1) * position.z : 35;
        const dxPod = dx * 0.45,
          dyPod = dy * 0.45;

        for (let h = height; h > 20; --h) {
          stackPaintings.push(
            ...paintPod(ctx, position.x, position.y, dxPod, dyPod, h)
          );
        }
        // stackPaintings.push(
        //   ...paintAnimatedPod!(
        //     ctx,
        //     position.x,
        //     position.y,
        //     dx * 0.45,
        //     dy * 0.45,
        //     position.z ? (dz ?? 1) * position.z : 35
        //   )
        // );
      });
    }
  }

  report.log('Painter', { msg: 'try shrinking' });

  renderAnimated(ctx, stackPaintings, true, true);
  report.groupEnd();

  return [
    ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    () => {
      if (!!backCtx && !!backImageData && !!backRect) {
        report.debug('Painter', {
          msg: 'clearing last images',
          backCtx,
          backImageData,
          backRect,
        });
        backCtx.putImageData(backImageData, backRect[0], backRect[1]);
      }
    },
  ];
};

export const renderHighlightedBlocks: Painter.Render<
  BlockPositions | BlockPosition | null
> = (ctx, positions) => {
  if (!!!ctx) return null;
  report.groupCollapsed('Painter', 'renderHighlightedBlocks()');
  const stackPaintings: (() => void)[] = [];

  if (!!positions) {
    let paintBlock: Painter.PaintObject | null = null;
    report.log('Painter', {
      msg: 'on renderHighlightedBlocks',
      positions,
      arePositionsMap: !isSingleBlockPosition(positions),
    });
    switch (positions.kind) {
      case 'pod':
        paintBlock = positions?.viewType === 'flat' ? paintFlatPod : paintPod;
        break;
      case 'node':
        paintBlock = positions?.viewType === 'flat' ? paintFlatNode : paintNode;
        break;
    }

    !!lastSurface &&
      ctx.putImageData(lastSurface, ctx.canvas.width, ctx.canvas.height);

    if (isSingleBlockPosition(positions)) {
      stackPaintings.push(
        ...paintBlock!(
          ctx,
          positions.data.x,
          positions.data.y,
          positions.dx * 0.45,
          positions.dy * 0.45,
          positions.data.z ? (positions.dz ?? 1) * positions.data.z : 35,
          { selected: true }
        )
      );
    } else {
      const { dx, dy, dz } = positions;
      positions.data.forEach((position) => {
        stackPaintings.push(
          ...paintBlock!(
            ctx,
            position.x,
            position.y,
            dx * 0.45,
            dy * 0.45,
            position.z ? (dz ?? 1) * position.z : 35,
            { selected: true }
          )
        );
      });
    }
  }

  renderAnimated(ctx, stackPaintings, true, true);
  report.groupEnd();
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const renderGroups: Painter.Render<GroupPositions | null> = (
  ctx,
  positions
) => {
  if (!!!ctx) return null;
  report.groupCollapsed('Painter', 'renderGroups()');
  const stackPaintings: (() => void)[] = [];

  let paintArea: Painter.PaintArea | null = null;

  if (!!positions) {
    report.log('Painter', {
      msg: 'group positions on renderGroups',
      positions,
    });
    switch (positions.kind) {
      case 'deployments':
        paintArea = paintGroup;
    }

    if (!!paintArea) {
      positions.data.forEach((position) => {
        stackPaintings.push(
          ...paintArea!(
            ctx,
            position.start,
            position.end,
            positions.dx,
            positions.dy,
            5
          )
        );
      });
    }
  }

  render(ctx, stackPaintings, true, false);
  report.groupEnd();
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const translate: Painter.Translate = (ctx, snapshot, perspective) => {
  snapshot &&
    !!ctx &&
    ctx.putImageData(snapshot, perspective, -(perspective * 0.57));
};

export const clearRendered: Painter.ClearRendered = (ctx) => {
  if (!!!ctx) return;
  renderAnimated(ctx, [], true, false);
};
