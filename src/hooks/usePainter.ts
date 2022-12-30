import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import {
  clearRendered,
  renderBlocks,
  renderGrids,
  renderGroups,
  renderHighlightedBlocks,
  renderHoveredBlock,
  renderPoints,
  renderShrinkingBlocks,
  translate,
} from '~utils/painter';
import { getGridPositions, getPointPositions } from '~utils/positioner';

const isDevMode = process.env.NODE_ENV === 'development';

// NOTE grid & point is skippable because these are just for debugging.
export default (): [
  Painter.Ref,
  PointPosition | null,
  Painter.Positions,
  Painter.Paint,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<Dimensions>>,
  React.Dispatch<React.SetStateAction<Painter.Flag>>
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const [
    eventRef,
    perspective,
    hoveredPosition,
    shrankPositions,
    highlightedPositions,
    hoveredPointPosition,
    setLevelOnEvent,
    setRenderedPlotOnEvent,
  ] = usePainterEvent(dimensions);

  const [paintedHoveredPosition, setPaintedHoveredPosition] =
    useState<Painter.Position | null>(null);

  const canvasRef: Painter.Ref = {
    ...(isDevMode && {
      grid: useRef<HTMLCanvasElement | null>(null),
      points: useRef<HTMLCanvasElement | null>(null),
    }),
    base: useRef<HTMLCanvasElement | null>(null),
    groups2: useRef<HTMLCanvasElement | null>(null),
    groups1: useRef<HTMLCanvasElement | null>(null),
    blocks: useRef<HTMLCanvasElement | null>(null),
    stage: useRef<HTMLCanvasElement | null>(null),
    curtain1: useRef<HTMLCanvasElement | null>(null),
    curtain2: useRef<HTMLCanvasElement | null>(null),
    event: eventRef,
  };

  const [canvasContext, setCanvasContext] = useState<Painter.Context>({
    ...(isDevMode && {
      grid: null,
      points: null,
    }),
    base: null,
    groups2: null,
    groups1: null,
    blocks: null,
    stage: null,
    curtain1: null,
    curtain2: null,
    event: null,
  });

  const [visible, setVisible] = useState<Painter.Flag>({
    ...(isDevMode && {
      grid: true,
      point: true,
    }),
  });

  const [objectSnapshot, setObjectSnapshot] = useState<Painter.ObjectSnapshot>({
    groups2: null,
    groups1: null,
    blocks: null,
  });

  const [stageSnapshot, setStageSnapshot] = useState<ImageData | null>(null);
  const [curtainSnapshot, setCurtainSnapshot] = useState<ImageData | null>(
    null
  );

  const [clearStage, setClearStage] = useState<(() => void) | null>(null);
  const [clearCurtain, setClearCurtain] = useState<(() => void) | null>(null);

  const [_clearCurtain, _setClearCurtain] = useState<(() => void) | null>(null);

  /**
   * Synchronize canvas' client size to their elements' size
   */
  useEffect(() => {
    if (canvasRef.blocks.current === null) return;

    report.log(
      'usePainter',
      {
        msg: 'dimensions changed',
        width: dimensions.width,
        height: dimensions.height,
      },
      { listening: ['width', 'height'] }
    );

    Object.values(canvasRef).forEach((ref) => {
      if (ref.current) {
        ref.current.width = ref.current.clientWidth;
        ref.current.height = ref.current.clientHeight;
      }
    });
  }, [dimensions]);

  /**
   * Updata cancas context when canvasRef changed
   */
  useEffect(() => {
    setCanvasContext(
      (
        Object.entries(canvasRef) as [string, RefObject<HTMLCanvasElement>][]
      ).reduce(
        (acc, [key, ref]) => ({
          ...acc,
          [key]:
            ref?.current?.getContext('2d', { willReadFrequently: true }) ??
            null,
        }),
        canvasContext
      )
    );
  }, Object.values(canvasRef));

  /**
   * Paint if new plot is accepted.
   */
  const paint = useCallback(
    (plot: Positioner.Plot) => {
      report.groupCollapsed('usePainter', 'paint()');
      report.log('usePainter', { msg: 'plot changed', plot });

      setObjectSnapshot({
        groups2: renderGroups(canvasContext.groups2, plot.groups2),
        groups1: renderGroups(canvasContext.groups1, plot.groups1),
        blocks: renderBlocks(canvasContext.blocks, plot.blocks),
      });

      if (isDevMode) {
        renderGrids(
          canvasContext.grid ?? null,
          visible.grid
            ? getGridPositions(dimensions.width, dimensions.height, level ?? 2)
            : []
        );
        renderPoints(
          canvasContext.points ?? null,
          visible.points
            ? getPointPositions(dimensions.width, dimensions.height, level ?? 2)
            : []
        );
      }
      setLevelOnEvent(level);
      setRenderedPlotOnEvent(plot);
      report.groupEnd();
    },
    [dimensions, level, visible]
  );

  /**
   * Render hovered position if changed;
   */
  useEffect(() => {
    if (!!!canvasContext.stage) return;

    let snapshot: ImageData | null;
    let clear: (() => void) | null;

    if (!!hoveredPosition.block) {
      if (
        !!!paintedHoveredPosition ||
        hoveredPosition.block !== paintedHoveredPosition.block
      ) {
        [snapshot, clear] = renderHoveredBlock(
          canvasContext.stage,
          hoveredPosition.block
        );
        setStageSnapshot(snapshot);
        setClearStage(clear);
      } else {
        !!canvasContext.stage && clearRendered(canvasContext.stage);
      }
    }

    setTimeout(() => {
      setPaintedHoveredPosition(hoveredPosition);
    }, 100);

    return () => {
      clear && clear();
      setStageSnapshot(null);
      !!canvasContext.stage && clearRendered(canvasContext.stage);
    };
  }, [hoveredPosition]);

  /**
   * Render shrinking positions if changed.
   */
  useEffect(() => {
    if (
      !!!canvasContext.blocks ||
      !!!canvasContext.stage ||
      !!!canvasContext.curtain1 ||
      !!!canvasContext.curtain2
    )
      return;

    let snapshot: ImageData | null;
    let clear: (() => void) | null | undefined;

    // report.log(
    //   'usePainter',
    //   {
    //     msg: 'hoveredChanged',
    //     shrankPositionBlocks: shrankPositions.curtain1.blocks,
    //     hoveredPosition: paintedHoveredPosition?.block,
    //   },
    //   { listening: ['hoveredPosition', 'shrankPositionBlocks'] }
    // );

    if (!!paintedHoveredPosition) {
      if (shrankPositions.curtain1.blocks) {
        [snapshot, clear] = renderShrinkingBlocks(
          canvasContext.curtain1,
          shrankPositions.curtain1.blocks,
          canvasContext.blocks
        );
        setCurtainSnapshot(snapshot);
        _setClearCurtain(clear);
      }
    }

    return () => {
      // TODO: Add conditional statement if perspective changes
      // setCurtainSnapshot(null);
    };
  }, [paintedHoveredPosition]);

  useEffect(() => {
    report.log('usePainter', { msg: 'set curtainSnapshot' });
    setClearCurtain(_clearCurtain);
    if (!!curtainSnapshot) {
    } else {
      // !!canvasContext.curtain1 && clearRendered(canvasContext.curtain1);
    }

    return () => {};
  }, [curtainSnapshot]);

  useEffect(() => {
    clearCurtain && clearCurtain();
  }, [clearCurtain]);

  /**
   * Render highlighted positions if changed.
   */
  useEffect(() => {
    if (!!!canvasContext.stage) return;

    report.log('usePainter', {
      msg: 'highlightPosition Changed',
      highlightedPositions,
    });

    // TODO code renderHighlightedBlock()dj
  }, [highlightedPositions]);

  /**
   * Translate canvases if perspective has changed.
   */
  useEffect(() => {
    translate(canvasContext.blocks, objectSnapshot.blocks, perspective);
    translate(canvasContext.groups1, objectSnapshot.groups1, perspective);
    // TODO Find a way to get ImageData on return callback function of subSnapShot
    // translate(canvasContext.stage, stageSnapshot, perspective);
    // translate(canvasContext.curtain1, curtainSnapshot, perspective);
    // translate(canvasContext.curtain2, curtainSnapshot, perspective);
    setStageSnapshot(null);
    setCurtainSnapshot(null);
  }, [perspective]);

  return [
    canvasRef,
    hoveredPointPosition,
    highlightedPositions,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
