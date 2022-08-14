import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePainterEvent } from '~hooks';
import { report } from '~utils/logger';
import { renderBlocks, renderGrids, renderPoints } from '~utils/painter';
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
  // const [plot, setPlot] = useState<Positioner.Plot | null>(null);
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const [
    eventRef,
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
    base: true,
    groups2: true,
    groups1: true,
    blocks: true,
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
              ref.current,
              getGridPositions(dimensions.width, dimensions.height, level ?? 2)
            );
            break;
          case 'points':
            renderPoints(
              ctx,
              ref.current,
              getPointPositions(dimensions.width, dimensions.height, level ?? 2)
            );
            break;
          case 'blocks':
            renderBlocks(ctx, ref.current, plot.blocks);
            break;
          case 'base':
            renderBlocks(ctx, ref.current, plot.blocks, true);
            break;
          case 'groups1':
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
    if (highlightedPointPosition === null) return;
    (
      Object.entries(refMap) as [
        keyof Painter.RefMap,
        RefObject<HTMLCanvasElement>
      ][]
    ).map(([refName, ref]) => {
      const ctx = ref.current && ref.current.getContext('2d');
      if (ctx === null || ref.current === null) return;
      switch (refName) {
        case 'points':
          renderPoints(ctx, ref.current, [highlightedPointPosition]);
          break;
        case 'blocks':
          // renderBlocks(ctx, ref.current, [highlightedBlockPositions]);
          break;
      }
    });
  }, [highlightedPointPosition]);

  return [
    refMap,
    highlightedPointPosition,
    paint,
    setLevel,
    setDimensions,
    setVisible,
  ];
};
