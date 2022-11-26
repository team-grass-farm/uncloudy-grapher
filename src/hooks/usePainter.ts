import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import {
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
    cutton: useRef<HTMLCanvasElement | null>(null),
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
    cutton: null,
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
  const [cuttonSnapshot, setCuttonSnapshot] = useState<ImageData | null>(null);

  const [testingFn, setTestingFn] = useState<(() => void)[]>([]);

  /**
   * Synchronize canvas' client size to their elements' size
   */
  useEffect(() => {
    if (canvasRef.blocks.current === null) return;
    report.log('usePainter', { msg: 'dimensions changed', dimensions });
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
    const a = (
      Object.entries(canvasRef) as [string, RefObject<HTMLCanvasElement>][]
    ).reduce(
      (acc, [key, ref]) => ({
        ...acc,
        [key]:
          ref?.current?.getContext('2d', { willReadFrequently: true }) ?? null,
      }),
      canvasContext
    );

    report.log('usePainter', { msg: 'canvasContext set()', a });
    setCanvasContext(a);
  }, Object.values(canvasRef));

  /**
   * Paint if new plot is accepted.
   */
  const paint = useCallback(
    (plot: Positioner.Plot) => {
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
    },
    [dimensions, level, visible]
  );

  // const renderHoveredPosition = useCallback(
  //   async (
  //     ctxStage: CanvasRenderingContext2D,
  //     hoveredBlockPosition: BlockPosition | null
  //   ) => {
  //     const [image, callbackFn] = await renderHoveredBlock(
  //       ctxStage,
  //       hoveredBlockPosition
  //     );

  //     !!image && setStageSnapshot(image);

  //     return () => {
  //       callbackFn && callbackFn();
  //     };
  //   },
  //   []
  // );

  // /**
  //  * Render hovered position if changed;
  //  */
  useEffect(() => {
    if (!!!canvasContext.stage) return;

    // renderHoveredBlock(ctxStage, hoveredPosition.block);
    // setPaintedHoveredPosition(hoveredPosition);
  }, [hoveredPosition]);

  const renderShrankPositions = useCallback(async () => {
    if (
      !!!canvasContext.blocks ||
      !!!canvasContext.stage ||
      !!!canvasContext.cutton
    )
      return;

    report.log('usePainter', {
      msg: 'shranked',
      ctxBlock: canvasContext.blocks.getImageData(0, 0, 10, 10),
    });

    // hoveredPosition && renderBlocks(ctxStage, hoveredPosition.block);
    const value = await renderShrinkingBlocks(
      canvasContext.cutton,
      shrankPositions.cutton.blocks,
      canvasContext.blocks
    );

    report.log('usePainter', { msg: 'shranked (done)', value });

    const [image, callbackFn] = value;

    !!image && setCuttonSnapshot(image);
    !!callbackFn && addCallbackFn(callbackFn);
    // const test = () => console.log('hi');
    // setTestingFn({ test });
    report.log('usePainter', { msg: 'shranked (done2)' });
  }, [canvasContext, hoveredPosition]);

  const addCallbackFn = useCallback(
    (fn: () => void) => {
      testingFn.push(fn);
      report.log('usePainter', { msg: 'shranked (pushed)' });
    },
    [testingFn]
  );

  // useEffect(() => {
  //   report.log('usePainter', [{ msg: 'testingFn', testingFn }]);
  // }, [testingFn]);

  /**
   * Render shrinking positions if changed.
   */
  useEffect(() => {
    // !!shrankPositions.blocks &&
    //   !isBlockPosition(shrankPositions.blocks) &&
    //   report.log('usePainter', [
    //     {
    //       msg: `shrinking ${[
    //         ...shrankPositions.blocks.data.keys(),
    //       ].toString()}`,
    //       shrinkedBlockData: shrankPositions.blocks?.data,
    //     },
    //   ]);

    // async () => {
    //   const [image, callbackShrinkingFn] = renderShrinkingBlocks(
    //     ctxCutton,
    //     shrankPositions.cutton.blocks,
    //     ctxBlock
    //   );

    //   !!image && setCuttonSnapshot(image);
    // };

    // return () => {
    //   callbackShrinkingFn && callbackShrinkingFn();
    // };

    setPaintedHoveredPosition(hoveredPosition);

    report.log(
      'usePainter',
      {
        msg: 'hoveredChanged',
        shrankPositionBlocks: shrankPositions.cutton.blocks,
        hoveredPosition: hoveredPosition.block,
      },
      { listening: ['hoveredPosition', 'shrankPositionBlocks'] }
    );

    if (!!hoveredPosition.block) {
      report.log('usePainter', {
        msg: 'exists hoveredPosition.block',
        conditions: hoveredPosition.block !== paintedHoveredPosition?.block,
      });
      if (
        !!!paintedHoveredPosition ||
        hoveredPosition.block !== paintedHoveredPosition.block
      ) {
        // if (testingFn) {
        //   report.info('usePainter', ['executed TestingFn', testingFn]);
        //   testingFn();
        // }
        if (shrankPositions.cutton.blocks) {
          renderShrankPositions();
        }
      }
    }

    return () => {
      if (!!testingFn) {
        report.log(
          'usePainter',
          { msg: 'executed TestingFn', testingFn },
          {
            listening: ['testingFn'],
          }
        );
        testingFn.map((fn) => fn());
        setTestingFn([]);
      }
    };
  }, [hoveredPosition]);

  // useEffect(() => {
  //   return () => {
  //     if (!!shrankPositions.cutton.blocks) {
  //       report.info('usePainter', ['executed TestingFn', testingFn]);
  //       !!testingFn && testingFn();
  //     }
  //   };
  // }, [shrankPositions, testingFn, canvasRef.blocks]);

  /**
   * Render highlighted positions if changed.
   */
  useEffect(() => {
    if (!!!canvasContext.stage) return;

    report.log('usePainter', {
      msg: 'highlightPosition Changed',
      highlightedPositions,
    });

    // TODO code renderHighlightedBlock()
  }, [highlightedPositions]);

  /**
   * Translate canvases if perspective has changed.
   */
  useEffect(() => {
    translate(canvasContext.blocks, objectSnapshot.blocks, perspective);
    translate(canvasContext.groups1, objectSnapshot.groups1, perspective);
    // TODO Find a way to get ImageData on return callback function of subSnapShot
    translate(canvasContext.stage, stageSnapshot, perspective);
    translate(canvasContext.cutton, cuttonSnapshot, perspective);
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
