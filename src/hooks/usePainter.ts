import React, { RefObject, useEffect, useRef, useState } from 'react';
import { usePainterEvent } from '~hooks';
import { renderGrids, renderObjects, renderPoints } from '~utils/painter';
import { getPointPositions, resetPointPositions } from '~utils/positioner';

type Layer = 'group2' | 'group1' | 'block';
type ResourceMap = Partial<Record<PointType | GroupType, any>>;

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
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<ResourceMap>>,
  React.Dispatch<React.SetStateAction<FlagMap>>,
  SelectedPointPosition | null
] => {
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [level, setLevel] = useState<1 | 2 | 3>(_level);
  const [resources, setResources] = useState<ResourceMap>({});
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({ width: 0, height: 0 });
  const [pointPositions, setPointPositions] = useState<PointPosition[]>([]);

  const [eventRef, highlightedPointPosition] = usePainterEvent(level);
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
    const handleResize = () => {
      if (refMap.block.current === null) return;
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
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    resetPointPositions();
    setPointPositions(
      getPointPositions(dimensions.width, dimensions.height, level ?? 2)
    );
  }, [dimensions]);

  useEffect(() => {
    Object.entries(refMap).map(([refName, ref]) => {
      const ctx = ref.current && ref.current.getContext('2d');
      if (ctx === null || ref.current === null) return;
      switch (refName) {
        case 'grid':
          renderGrids(ctx, ref.current, visible.grid ?? false);
          break;
        case 'point':
          renderPoints(
            ctx,
            ref.current,
            pointPositions,
            highlightedPointPosition,
            visible.point ?? false
          );
          return;
        default:
          // TODO render by resources
          // renderObjects(ctx, ref.current, dataChunks, refName);
          return;
      }
    });
  }, [highlightedPointPosition, resources, pointPositions, visible]);

  useEffect(() => {
    !!highlightedPointPosition &&
      console.debug(`bounded event: `, highlightedPointPosition);
  }, [highlightedPointPosition]);

  return [refMap, setLevel, setResources, setVisible, highlightedPointPosition];
};
