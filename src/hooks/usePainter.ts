import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { isNull } from 'util';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import {
  clearRendered,
  renderBlocks,
  renderGrids,
  renderGroups,
  renderHighlightedBlocks,
  renderHighlightedPoints,
  renderPoints,
  translate,
} from '~utils/painter';
import { getGridPositions, getPointPositions } from '~utils/positioner';

// NOTE grid & point is skippable because these are just for debugging.
export default (): [
  Painter.RefMap,
  PointPosition | null,
  Painter.Paint,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<Dimensions>>,
  React.Dispatch<React.SetStateAction<Painter.FlagMap>>
] => {
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [
    eventRef,
    perspective,
    highlightedPointPosition,
    highlightedBlockPositions,
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

      (
        Object.entries(refMap) as [
          keyof Painter.RefMap,
          RefObject<HTMLCanvasElement>
        ][]
      ).map(([refName, ref]) => {
        const ctx = ref.current && ref.current.getContext('2d');
        if (ctx === null || ref.current === null) return;
        switch (refName) {
          case 'grid':
            renderGrids(
              ctx,
              visible.grid
                ? getGridPositions(
                    dimensions.width,
                    dimensions.height,
                    level ?? 2
                  )
                : []
            );
            break;
          case 'points':
            renderPoints(
              ctx,
              visible.points
                ? getPointPositions(
                    dimensions.width,
                    dimensions.height,
                    level ?? 2
                  )
                : []
            );
            break;
          case 'blocks':
            // renderBlocks(ctx, plot.blocks);
            break;
          case 'base':
            // renderBlocks(ctx, ref.current, plot.blocks, true);
            break;
          case 'groups1':
            // renderGroups(ctx, plot.groups1);
            break;
          case 'groups2':
            // data &&
            //   data.group2 &&
            //   renderGroups(ctx, ref.current, data.group2, null, true, level);
            break;
          default:
            break;
        }
      });
      setLevelOnEvent(level);
    },
    [dimensions, level, visible]
  );

  useEffect(() => {
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

  useEffect(() => {
    const ctx = refMap.event.current && refMap.event.current.getContext('2d');
    if (!refMap.event.current) return;
    else if (highlightedPointPosition === null) {
      clearRendered(ctx, refMap.event.current);
    }

    if (!!highlightedPointPosition && visible.points) {
      renderHighlightedPoints(ctx, [highlightedPointPosition]);
    }
    if (!!highlightedBlockPositions) {
      report.log('usePainter', [
        'executed renderHighlightedBlocks(): ',
        highlightedBlockPositions,
      ]);
      renderHighlightedBlocks(ctx, highlightedBlockPositions);
    }
  }, [highlightedPointPosition, highlightedBlockPositions]);

  return [
    refMap,
    highlightedPointPosition,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
