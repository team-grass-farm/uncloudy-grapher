import { RefObject, useCallback, useEffect, useState } from 'react';
import { report } from '~utils/logger';
import {
  getAdminViewPositions,
  getDeveloperViewPositions,
} from '~utils/positioner';

export default <T extends string = 'type'>(
  ref: RefObject<HTMLCanvasElement>
): [Dimensions, Positioner.Plot | null, Positioner.Pose] => {
  const [plot, setPlot] = useState<Positioner.Plot | null>(null);
  const [resourceMap, setResourceMap] = useState<Positioner.ResourceMap | null>(
    null
  );
  const [level, setLevel] = useState<1 | 2 | 3 | null>(null);
  const [option, setOption] = useState<T[]>(['type'] as T[]);
  const [adminPlot, setAdminPlot] = useState<Positioner.Plot | null>(null);
  const [devPlot, setDevPlot] = useState<Positioner.Plot | null>(null);

  const [paused, setPaused] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const pauser = () => setPaused(true);
    window.addEventListener('resize', pauser);
    return () => window.removeEventListener('resize', pauser);
  }, []);

  const pose = useCallback<Positioner.Pose>(
    (resourceMap, level) => {
      report.groupCollapsed('usePositioner', 'pose()');
      report.log('usePositioner', { msg: 'resourceMap', resourceMap });
      resourceMap.type === 'admin'
        ? setAdminPlot(
            getAdminViewPositions(
              {
                type: 'admin',
                pods: option['pods'] ? resourceMap.pods : undefined,
                nodes: option['nodes'],
              } as Positioner.ResourceMap<'admin'>,
              dimensions.width,
              dimensions.height,
              level
            )
          )
        : setDevPlot(
            getDeveloperViewPositions(
              resourceMap,
              dimensions.width,
              dimensions.height,
              level
            )
          );
      setResourceMap(resourceMap);
      setLevel(level);
      report.groupEnd();
    },
    [dimensions]
  );

  useEffect(() => {
    let handler: NodeJS.Timeout | undefined;
    if (paused) {
      if (ref.current === null) return;
      report.log('usePositioner', { msg: 'excuted handleResize()' });
      setDimensions({
        width: ref.current.width,
        height: ref.current.height,
      });
      !!resourceMap && !!level && pose(resourceMap, level);
      setPaused(false);
    } else {
      handler = undefined;
    }
    return () => {
      clearTimeout(handler);
      report.log('usePositioner', { msg: 'timeout cleared', paused });
    };
  }, [paused]);

  useEffect(() => setPlot(adminPlot), [adminPlot]);
  useEffect(() => setPlot(devPlot), [devPlot]);

  return [dimensions, plot, pose];
};
