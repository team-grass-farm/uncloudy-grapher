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

  const refMap: Painter.Ref = {
    ...(isDevMode && {
      grid: useRef<HTMLCanvasElement>(null),
      points: useRef<HTMLCanvasElement>(null),
    }),
    base: useRef<HTMLCanvasElement>(null),
    groups2: useRef<HTMLCanvasElement>(null),
    groups1: useRef<HTMLCanvasElement>(null),
    blocks: useRef<HTMLCanvasElement>(null),
    stage: useRef<HTMLCanvasElement>(null),
    cutton: useRef<HTMLCanvasElement>(null),
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

  const [subSnapshot, setSubSnapshot] = useState<Painter.SubSnapshot>({
    base: null,
    stage: null,
    cutton: null,
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

      setObjectSnapshot({
        groups2: renderGroups(
          refMap.groups2?.current?.getContext('2d') ?? null,
          plot.groups2
        ),
        groups1: renderGroups(
          refMap.groups1?.current?.getContext('2d') ?? null,
          plot.groups1
        ),
        blocks: renderBlocks(
          refMap.blocks?.current?.getContext('2d') ?? null,
          plot.blocks
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
      const { row, column } = highlightedPointPosition ?? {
        row: -1,
        column: -1,
      };
      const itVal = blocks.data.get(row + ',' + column) ?? null;

      report.log('usePainter', [{ highlightedPointPosition }]);

      report.log('usePainter', [
        { blocks, itVal, value: blocks.data.values().next().value },
      ]);

      // TODO apply perspective parameter on setHighlightedPositions()
      setHighlightedPositions({
        point: highlightedPointPosition,
        block: !!itVal
          ? ({
              ...blocks,
              data: itVal,
            } as BlockPosition)
          : null,
        group1: null,
        group2: null,
      });
    }
  }, [highlightedPointPosition, renderedPlot]);

  useEffect(() => {
    const ctx = refMap.stage.current?.getContext('2d');
    if (!!!ctx) return;

    report.log('usePainter', [{ highlightedPositions }]);

    if (!!highlightedPositions.block && !!renderedPlot?.blocks) {
      setSubSnapshot({
        base: null,
        stage: renderHighlightedBlocks(ctx, highlightedPositions.block),
        cutton: null,
      });
    }
  }, [highlightedPositions]);

  useEffect(() => {
    report.debug('usePainter', [{ perspective }]);
    translate(
      refMap.blocks.current?.getContext('2d'),
      objectSnapshot.blocks,
      perspective
    );
    translate(
      refMap.groups1.current?.getContext('2d'),
      objectSnapshot.groups1,
      perspective
    );
    translate(
      refMap.stage.current?.getContext('2d'),
      subSnapshot.stage,
      perspective
    );
    translate(
      refMap.cutton.current?.getContext('2d'),
      subSnapshot.cutton,
      perspective
    );
  }, [perspective]);

  return [
    refMap,
    hoveredPointPosition,
    highlightedPositions,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
