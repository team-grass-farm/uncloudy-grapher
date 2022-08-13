import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { renderGrids, renderObjects, renderPoints } from '~utils/painter';
import { getGridPositions, getPointPositions } from '~utils/positioner';

// NOTE grid & point is skippable because these are just for debugging.
export default (
  _level: 1 | 2 | 3
): [
  Painter.RefMap,
  1 | 2 | 3,
  Painter.Paint,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<Painter.FlagMap>>,
  PointPosition | null
] => {
  const [plot, setPlot] = useState<Positioner.Plot | null>(null);
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [forcePaint, setForcePaint] = useState<boolean>(true);
  const [level, setLevel] = useState<1 | 2 | 3>(_level);
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({ width: 0, height: 0 });

  const [eventRef, setLevelOnEvent, highlightedPointPosition] = usePainterEvent(
    dimensions,
    level
  );
  const refMap: Painter.RefMap = {
    ...(isDevMode && {
      grid: useRef<HTMLCanvasElement>(null),
      points: useRef<HTMLCanvasElement>(null),
    }),
    main: useRef<HTMLCanvasElement>(null),
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
    main: true,
    groups2: true,
    groups1: true,
    blocks: true,
  });

  useEffect(() => {
    if (forcePaint || refMap.blocks.current === null) return;
    setDimensions({
      width: refMap.blocks.current.clientWidth,
      height: refMap.blocks.current.clientHeight,
    });
    Object.values(refMap).forEach((ref) => {
      if (ref.current) {
        ref.current.width = ref.current.clientWidth;
        ref.current.height = ref.current.clientHeight;
      }
    });
  }, [forcePaint]);

  const paint = useCallback(
    (plot: Positioner.Plot) => {
      console.debug('[usePainter] plot: ', plot);
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
              getGridPositions(dimensions.width, dimensions.height, level ?? 2),
              visible.grid ?? false
            );
            break;
          case 'points':
            renderPoints(
              ctx,
              ref.current,
              getPointPositions(
                dimensions.width,
                dimensions.height,
                level ?? 2
              ),
              visible.points ?? false
            );
            break;
          case 'blocks':
            plot &&
              renderObjects(
                ctx,
                ref.current,
                plot.blocks,
                visible.blocks ?? false
              );
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
          renderPoints(
            ctx,
            ref.current,
            getPointPositions(dimensions.width, dimensions.height, level ?? 2),
            visible.points ?? false,
            highlightedPointPosition
          );
          break;
        case 'blocks':
          plot &&
            highlightedPointPosition &&
            renderObjects(
              ctx,
              ref.current,
              plot.blocks,
              visible.blocks ?? false,
              highlightedPointPosition
            );
          break;
      }
    });
  }, [highlightedPointPosition]);

  return [refMap, level, paint, setLevel, setVisible, highlightedPointPosition];
};
