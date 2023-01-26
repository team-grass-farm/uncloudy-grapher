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
import { getGridViews, getPointViews } from '~utils/positioner';

const isDevMode = process.env.NODE_ENV === 'development';

// NOTE grid & point is skippable because these are just for debugging.
export default (): [
  Painter.Ref,
  PointPosition | null,
  Painter.SavedViews,
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
    hoveredView,
    shrankViews,
    highlightedViews,
    hoveredPointPosition,
    setLevelOnEvent,
    setRenderedPlotOnEvent,
  ] = usePainterEvent(dimensions);

  const [paintedHoveredView, setPaintedHoveredView] =
    useState<Painter.SavedView | null>(null);

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
  const [curtain1Snapshot, setCurtain1Snapshot] = useState<ImageData | null>(
    null
  );
  const [curtain2Snapshot, setCurtain2Snapshot] = useState<ImageData | null>(
    null
  );

  const [clearStage, setClearStage] = useState<(() => void) | null>(null);
  const [clearCurtain1, setClearCurtain1] = useState<(() => void) | null>(null);
  const [clearCurtain2, setClearCurtain2] = useState<(() => void) | null>(null);

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
            ? getGridViews(dimensions.width, dimensions.height, level ?? 2)
            : null
        );
        renderPoints(
          canvasContext.points ?? null,
          visible.points
            ? getPointViews(dimensions.width, dimensions.height, level ?? 2)
            : null
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

    if (!!hoveredView.block) {
      if (
        !!!paintedHoveredView ||
        hoveredView.block !== paintedHoveredView.block
      ) {
        [snapshot, clear] = renderHoveredBlock(
          canvasContext.stage,
          hoveredView.block
        );
        setStageSnapshot(snapshot);
        setClearStage(clear);
      } else {
        !!canvasContext.stage && clearRendered(canvasContext.stage);
      }
    }

    setTimeout(() => {
      setPaintedHoveredView(hoveredView);
    }, 100);

    return () => {
      clear && clear();
      setStageSnapshot(null);
      !!canvasContext.stage && clearRendered(canvasContext.stage);
    };
  }, [hoveredView]);

  const saveCurtain = useCallback(
    ([snapshot, clear]: [
      ImageData | null,
      (() => void) | null | undefined
    ]) => {
      report.log('usePainter', { msg: 'saveCurtain()' });
      setCurtain1Snapshot(snapshot);
      setClearCurtain1(() => clear ?? null);
    },
    [curtain1Snapshot, clearCurtain1]
  );

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

    if (!!paintedHoveredView) {
      clearCurtain1 && clearCurtain1();
      if (shrankViews.curtain1.blocks) {
        saveCurtain(
          renderShrinkingBlocks(
            canvasContext.curtain1,
            shrankViews.curtain1.blocks,
            canvasContext.blocks
          )
        );
      } else {
        clearRendered(canvasContext.curtain1);
      }
    } else {
    }
  }, [paintedHoveredView]);

  /**
   * Render highlighted positions if changed.
   */
  useEffect(() => {
    if (!!!canvasContext.stage) return;

    report.log('usePainter', {
      msg: 'highlightViews Changed',
      highlightedViews,
    });

    // TODO code renderHighlightedBlock()
  }, [highlightedViews]);

  /**
   * Translate canvases if perspective has changed.
   */
  useEffect(() => {
    translate(canvasContext.blocks, objectSnapshot.blocks, perspective);
    translate(canvasContext.groups1, objectSnapshot.groups1, perspective);

    clearRendered(canvasContext.stage);
    clearRendered(canvasContext.curtain1);
    clearRendered(canvasContext.curtain2);

    setClearStage(null);
    setClearCurtain1(null);
    setClearCurtain2(null);
  }, [perspective]);

  return [
    canvasRef,
    hoveredPointPosition,
    highlightedViews,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
