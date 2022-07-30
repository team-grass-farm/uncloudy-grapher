import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { renderGrids, renderObjects, renderPoints } from '~utils/painter';
import { getGridPositions, getPointPositions } from '~utils/positioner';

type Layer = 'block' | 'group1' | 'group2';
type ResourcePositionMap = Partial<
  Record<`${PointType}s`, PointPosition[]> &
    Record<`${GroupType}s`, GroupPosition[]>
>;
type Paint = (panelMode: 'dev' | 'admin', data: Resource.Map) => void;

// NOTE grid & point is skippable because these are just for debugging.
interface RefMap extends Record<Layer, RefObject<HTMLCanvasElement>> {
  grid?: RefObject<HTMLCanvasElement>;
  point?: RefObject<HTMLCanvasElement>;
  event: RefObject<HTMLCanvasElement>;
}
interface FlagMap extends Record<Layer, boolean> {
  grid?: boolean;
  point?: boolean;
}

export default (
  _level: 1 | 2 | 3
): [
  RefMap,
  Paint,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<FlagMap>>,
  PointPosition | null
] => {
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [paused, setPaused] = useState<boolean>(true);
  const [level, setLevel] = useState<1 | 2 | 3>(_level);
  const [resources, setResources] = useState<ResourcePositionMap>({});
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({ width: 0, height: 0 });

  const [eventRef, setLevelOnEvent, highlightedPointPosition] = usePainterEvent(
    dimensions,
    level
  );
  const refMap: RefMap = {
    ...(isDevMode && {
      grid: useRef<HTMLCanvasElement>(null),
      point: useRef<HTMLCanvasElement>(null),
    }),
    group2: useRef<HTMLCanvasElement>(null),
    group1: useRef<HTMLCanvasElement>(null),
    block: useRef<HTMLCanvasElement>(null),
    event: eventRef,
  };
  const [visible, setVisible] = useState<FlagMap>({
    ...(isDevMode && {
      grid: true,
      point: true,
    }),
    group2: true,
    group1: true,
    block: true,
  });

  useEffect(() => {
    const pauser = () => setPaused(true);
    window.addEventListener('resize', pauser);
    return () => window.removeEventListener('resize', pauser);
  }, []);

  useEffect(() => {
    let handler: NodeJS.Timeout | undefined;
    if (paused) {
      handler = setTimeout(() => {
        if (refMap.block.current === null) return;
        console.log('executed handleResize()');
        setDimensions({
          width: refMap.block.current.clientWidth,
          height: refMap.block.current.clientHeight,
        });

        Object.values(refMap).forEach((ref) => {
          if (ref.current) {
            ref.current.width = ref.current.clientWidth;
            ref.current.height = ref.current.clientHeight;
          }
        });
        setPaused(false);
      }, 10);
    } else {
      handler = undefined;
    }
    return () => {
      clearTimeout(handler);
      console.debug('[usePainter] timeout cleared: ', paused);
    };
  }, [paused]);

  useEffect(() => {
    (
      Object.entries(refMap) as [keyof RefMap, RefObject<HTMLCanvasElement>][]
    ).map(([refName, ref]) => {
      const ctx = ref.current && ref.current.getContext('2d');
      if (ctx === null || ref.current === null) return;
      switch (refName) {
        case 'grid':
          renderGrids(
            ctx,
            ref.current,
            getGridPositions(dimensions.width, dimensions.height, level ?? 2),
            null,
            visible.grid ?? false
          );
          break;
        case 'point':
          renderPoints(
            ctx,
            ref.current,
            getPointPositions(dimensions.width, dimensions.height, level ?? 2),
            highlightedPointPosition,
            visible.point ?? false
          );
          break;
        case 'block':
          break;
        case 'group1':
          break;
        case 'group2':
          break;
        default:
          // renderObjects(
          //   ctx,
          //   ref.current,
          //   getObje
          //   [],
          //   null,
          //   visible.block ?? false,
          //   'node'
          // );
          break;
      }
    });
    setLevelOnEvent(level);
  }, [highlightedPointPosition, resources, dimensions, level, visible]);

  const paint = useCallback<Paint>((panelMode, data) => {
    if (panelMode === 'admin') {
      data;
    } else {
    }
  }, []);

  return [refMap, paint, setLevel, setVisible, highlightedPointPosition];
};
