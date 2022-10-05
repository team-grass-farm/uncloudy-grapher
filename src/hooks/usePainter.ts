import { useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import {
    clearRendered, renderBlocks, renderGrids, renderGroups, renderHighlightedBlocks,
    renderHighlightedPoints, renderPoints, translate
} from '~utils/painter';
import { getGridPositions, getPointPositions } from '~utils/positioner';

const isDevMode = process.env.NODE_ENV === 'development';

// NOTE grid & point is skippable because these are just for debugging.
export default (): [
  Painter.RefMap,
  PointPosition | null,
  Painter.Paint,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<Dimensions>>,
  React.Dispatch<React.SetStateAction<Painter.FlagMap>>
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [renderedPlot, setRenderedPlot] = useState<Positioner.Plot | null>(
    null
  );
  const [eventRef, perspective, highlightedPointPosition, setLevelOnEvent] =
    usePainterEvent(dimensions);

  const refMap: Painter.RefMap = {
    ...(isDevMode && {
      grid: useRef<HTMLCanvasElement>(null),
      points: useRef<HTMLCanvasElement>(null),
    }),
    base: useRef<HTMLCanvasElement>(null),
    groups2: useRef<HTMLCanvasElement>(null),
    groups1: useRef<HTMLCanvasElement>(null),
    blocks: useRef<HTMLCanvasElement>(null),
    event: eventRef,
  };

  const [visible, setVisible] = useState<Painter.FlagMap>({
    ...(isDevMode && {
      grid: true,
      point: true,
    }),
  });

  const [snapshotMap, setSnapshotMap] = useState<Painter.SnapshotMap>({
    base: null,
    blocks: null,
    groups1: null,
    groups2: null,
  });

  useEffect(() => {
    if (refMap.blocks.current === null) return;
    report.log('usePainter', ['dimensions changed:', dimensions]);
    Object.values(refMap).forEach((ref) => {
      if (ref.current) {
        ref.current.width = ref.current.clientWidth;
        ref.current.height = ref.current.clientHeight;
      }
    });
  }, [dimensions]);

  const paint = useCallback(
    (plot: Positioner.Plot) => {
      report.log('usePainter', ['plot: ', plot]);

      setSnapshotMap({
        base: null,
        blocks: renderBlocks(
          refMap.blocks?.current?.getContext('2d') ?? null,
          plot.blocks
        ),
        groups1: renderGroups(
          refMap.groups1?.current?.getContext('2d') ?? null,
          plot.groups1
        ),
        groups2: renderGroups(
          refMap.groups2?.current?.getContext('2d') ?? null,
          plot.groups2
        ),
      });

      if (isDevMode) {
        renderGrids(
          refMap.grid?.current?.getContext('2d') ?? null,
          visible.grid
            ? getGridPositions(dimensions.width, dimensions.height, level ?? 2)
            : []
        );
        renderPoints(
          refMap.points?.current?.getContext('2d') ?? null,
          visible.points
            ? getPointPositions(dimensions.width, dimensions.height, level ?? 2)
            : []
        );
      }
      setRenderedPlot(plot);
      setLevelOnEvent(level);
    },
    [dimensions, level, visible]
  );

  useEffect(() => {
    const ctx = refMap.event.current?.getContext('2d');
    if (!!!ctx) return;
    else if (highlightedPointPosition === null) {
      clearRendered(ctx);
    }

    if (!!highlightedPointPosition && visible.points) {
      if (visible.points) {
        renderHighlightedPoints(ctx, [highlightedPointPosition]);
      }

      if (renderedPlot) {
        const { row, column } = highlightedPointPosition;
        const highlightedBlock = renderedPlot.blocks.data.get([row, column]);

        if (!!highlightedBlock) {
          renderHighlightedBlocks(ctx, {
            ...renderedPlot.blocks,
            data: new Map([
              [[row, column] as [number, number], highlightedBlock],
            ]),
          });
          report.warn('usePainter', ['rendered.']);
        }
      }
      // renderHighlightedBlocks(ctx, highlightedBlockPositions);
    }
  }, [highlightedPointPosition, renderedPlot]);

  useEffect(() => {
    report.debug('usePainter', [{ perspective }]);
    translate(
      refMap.blocks.current?.getContext('2d'),
      snapshotMap.blocks,
      perspective
    );
    translate(
      refMap.groups1.current?.getContext('2d'),
      snapshotMap.groups1,
      perspective
    );
  }, [perspective]);

  return [
    refMap,
    highlightedPointPosition,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
