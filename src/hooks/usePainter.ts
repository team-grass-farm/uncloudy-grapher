import { useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import {
  clearRendered,
  renderBlocks,
  renderGrids,
  renderGroups,
  renderHighlightedBlocks,
  renderHoveredBlocks,
  renderHoveredPoints,
  renderPoints,
  translate,
} from '~utils/painter';
import { getGridPositions, getPointPositions } from '~utils/positioner';

const isDevMode = process.env.NODE_ENV === 'development';

// NOTE grid & point is skippable because these are just for debugging.
export default (): [
  Painter.RefMap,
  Painter.Positions,
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
  const [
    eventRef,
    perspective,
    hoveredPointPosition,
    highlightedPointPosition,
    setLevelOnEvent,
  ] = usePainterEvent(dimensions);

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

  const [highlightedPositions, setHighlightedPositions] =
    useState<Painter.Positions>({
      point: null,
      block: null,
      group1: null,
      group2: null,
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
    else if (hoveredPointPosition === null) {
      clearRendered(ctx);
    }

    if (!!hoveredPointPosition) {
      if (visible.points) {
        renderHoveredPoints(ctx, [hoveredPointPosition]);
      }
    }
  }, [hoveredPointPosition, renderedPlot]);

  useEffect(() => {
    if (!!!renderedPlot) {
      setHighlightedPositions({
        point: null,
        block: null,
        group1: null,
        group2: null,
      });
    } else if (!!renderedPlot.blocks) {
      const { blocks } = renderedPlot;
      const itVal = blocks.data.get('2,0') ?? null;

      report.log('usePainter', [
        { blocks, itVal, value: blocks.data.values().next().value },
      ]);

      setHighlightedPositions({
        point: highlightedPointPosition,
        block: !!itVal ? { ...blocks, data: itVal } : null,
        group1: null,
        group2: null,
      });
    }
  }, [highlightedPointPosition, renderedPlot]);

  useEffect(() => {
    const ctx = refMap.event.current?.getContext('2d');
    if (!!!ctx) return;

    report.log('usePainter', [{ highlightedPositions }]);

    if (!!highlightedPositions.block && !!renderedPlot?.blocks) {
      renderHighlightedBlocks(ctx, highlightedPositions.block);
      report.warn('usePainter', ['rendered.']);
    }
  }, [highlightedPositions]);

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
    highlightedPositions,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
