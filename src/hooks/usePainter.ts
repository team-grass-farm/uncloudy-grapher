import { useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import {
  renderBlocks,
  renderGrids,
  renderGroups,
  renderHighlightedBlocks,
  renderHoveredBlock,
  renderPoints,
  renderShrinkingBlock,
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
  // const [renderedPlot, setRenderedPlot] = useState<Positioner.Plot | null>(
  //   null
  // );
  const [
    eventRef,
    perspective,
    hoveredPosition,
    shrinkedPositions,
    highlightedPositions,
    hoveredPointPosition,
    setLevelOnEvent,
    setRenderedPlotOnEvent,
  ] = usePainterEvent(dimensions);

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
    cutton: useRef<HTMLCanvasElement | null>(null),
    event: eventRef,
  };

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
  const [cuttonSnapshot, setCuttonSnapshot] = useState<ImageData | null>(null);

  // const [subSnapshot, setSubSnapshot] = useState<Painter.SubSnapshot>({
  //   base: null,
  //   stage: null,
  //   cutton: null,
  // });

  /**
   * Synchronize canvas' client size to their elements' size
   */
  useEffect(() => {
    if (canvasRef.blocks.current === null) return;
    report.log('usePainter', ['dimensions changed:', dimensions]);
    Object.values(canvasRef).forEach((ref) => {
      if (ref.current) {
        ref.current.width = ref.current.clientWidth;
        ref.current.height = ref.current.clientHeight;
      }
    });
  }, [dimensions]);

  /**
   * Paint if new plot is accepted.
   */
  const paint = useCallback(
    (plot: Positioner.Plot) => {
      report.log('usePainter', ['plot: ', plot]);

      setObjectSnapshot({
        groups2: renderGroups(
          canvasRef.groups2?.current?.getContext('2d') ?? null,
          plot.groups2
        ),
        groups1: renderGroups(
          canvasRef.groups1?.current?.getContext('2d') ?? null,
          plot.groups1
        ),
        blocks: renderBlocks(
          canvasRef.blocks?.current?.getContext('2d') ?? null,
          plot.blocks
        ),
      });

      if (isDevMode) {
        renderGrids(
          canvasRef.grid?.current?.getContext('2d') ?? null,
          visible.grid
            ? getGridPositions(dimensions.width, dimensions.height, level ?? 2)
            : []
        );
        renderPoints(
          canvasRef.points?.current?.getContext('2d') ?? null,
          visible.points
            ? getPointPositions(dimensions.width, dimensions.height, level ?? 2)
            : []
        );
      }
      setLevelOnEvent(level);
      setRenderedPlotOnEvent(plot);
    },
    [dimensions, level, visible]
  );

  /**
   * Render hovered position if changed;
   */
  useEffect(() => {
    const ctxStage = canvasRef.stage.current?.getContext('2d');
    if (!!!ctxStage) return;

    const [image, callbackFn] = renderHoveredBlock(
      ctxStage,
      hoveredPosition.block
    );

    !!image && setStageSnapshot(image);

    return () => {
      callbackFn && callbackFn();
    };
  }, [hoveredPosition]);

  /**
   * Render shrinking positions if changed.
   */
  useEffect(() => {
    const ctxBlock = canvasRef.blocks.current?.getContext('2d');
    const ctxCutton = canvasRef.cutton.current?.getContext('2d');
    if (!!!ctxCutton || !!!ctxBlock) return;

    !!shrinkedPositions.blocks &&
      shrinkedPositions.blocks.data instanceof Map &&
      report.log('usePainter', [
        {
          msg: `shrinking ${[
            ...shrinkedPositions.blocks?.data.keys(),
          ].toString()}`,
          shrinkedBlockData: shrinkedPositions.blocks?.data,
        },
      ]);

    const [image, callbackFn] = renderShrinkingBlock(
      ctxCutton,
      shrinkedPositions.blocks,
      ctxBlock
    );

    !!image && setCuttonSnapshot(image);

    return () => {
      callbackFn && callbackFn();
    };
  }, [shrinkedPositions]);

  /**
   * Render highlighted positions if changed.
   */
  useEffect(() => {
    const ctx: CanvasRenderingContext2D =
      canvasRef.stage.current?.getContext('2d');
    if (!!!ctx) return;

    report.log('usePainter', [{ highlightedPositions }]);

    // TODO code renderHighlightedBlock()
  }, [highlightedPositions]);

  /**
   * Translate canvases if perspective has changed.
   */
  useEffect(() => {
    report.debug('usePainter', [{ perspective }]);
    translate(
      canvasRef.blocks.current?.getContext('2d'),
      objectSnapshot.blocks,
      perspective
    );
    translate(
      canvasRef.groups1.current?.getContext('2d'),
      objectSnapshot.groups1,
      perspective
    );
    // TODO Find a way to get ImageData on return callback function of subSnapShot
    translate(
      canvasRef.stage.current?.getContext('2d'),
      stageSnapshot,
      perspective
    );
    translate(
      canvasRef.cutton.current?.getContext('2d'),
      cuttonSnapshot,
      perspective
    );
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
