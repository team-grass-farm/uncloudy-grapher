import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePainterEvent } from '~hooks';
import { renderGrids, renderObjects, renderPoints } from '~utils/painter';
import {
  addNodes,
  addPods,
  getAdminViewPositions,
  getDeveloperViewPositions,
  getGridPositions,
  getPointPositions,
} from '~utils/positioner';

type Layer = 'block' | 'group1' | 'group2';
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
  1 | 2 | 3,
  Paint,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<React.SetStateAction<FlagMap>>,
  PointPosition | null
] => {
  const [data, setData] = useState<Positioner.PositionMap | null>(null);
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [paused, setPaused] = useState<boolean>(true);
  const [level, setLevel] = useState<1 | 2 | 3>(_level);
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
      // handler = setTimeout(() => {
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
      // }, 0);
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
            visible.grid ?? false
          );
          break;
        case 'point':
          renderPoints(
            ctx,
            ref.current,
            getPointPositions(dimensions.width, dimensions.height, level ?? 2),
            visible.point ?? false
          );
          break;
        case 'block':
          data &&
            renderObjects(
              ctx,
              ref.current,
              data.block,
              visible.block ?? false,
              level
            );
          break;
        case 'group1':
          break;
        case 'group2':
          // data &&
          //   data.group2 &&
          //   renderGroups(ctx, ref.current, data.group2, null, true, level);
          break;
        default:
          break;
      }
    });
    setLevelOnEvent(level);
  }, [data, dimensions, level, visible]);

  useEffect(() => {
    (
      Object.entries(refMap) as [keyof RefMap, RefObject<HTMLCanvasElement>][]
    ).map(([refName, ref]) => {
      const ctx = ref.current && ref.current.getContext('2d');
      if (ctx === null || ref.current === null) return;
      switch (refName) {
        case 'point':
          renderPoints(
            ctx,
            ref.current,
            getPointPositions(dimensions.width, dimensions.height, level ?? 2),
            visible.point ?? false,
            level,
            highlightedPointPosition
          );
          break;
        case 'block':
          data &&
            highlightedPointPosition &&
            renderObjects(
              ctx,
              ref.current,
              data.block,
              visible.block ?? false,
              level,
              highlightedPointPosition
            );
          break;
      }
    });
  }, [highlightedPointPosition]);

  const paint = useCallback<Paint>(
    (panelMode, data) => {
      // TODO move this data fetcher to useFetcher.ts
      if (panelMode === 'admin') {
        data.nodes && addNodes(data.nodes);
        setData(
          getAdminViewPositions(
            dimensions.width,
            dimensions.height,
            level,
            10,
            6,
            { showClusters: false, showPods: false }
          )
        );
      } else {
        data.pods && addPods(data.pods);
        setData(
          getDeveloperViewPositions(
            dimensions.width,
            dimensions.height,
            level,
            10,
            8,
            { showDeployments: false, showNamespaces: true }
          )
        );
      }
    },
    [dimensions, level]
  );

  return [refMap, level, paint, setLevel, setVisible, highlightedPointPosition];
};
