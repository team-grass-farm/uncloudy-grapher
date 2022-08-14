import { useCallback, useEffect, useState } from 'react';
import { report } from '~utils/logger';

export default (
  ref: RefObject<HTMLCanvasElement>
): [
  Dimensions,
  Positioner.Plot | null,
  Positioner.Pose,
  React.Dispatch<1 | 2 | 3>
] => {
  const [plot, setPlot] = useState<Positioner.Plot | null>(null);
  const [adminPlot, setAdminPlot] = useState<Positioner.Plot | null>(null);
  const [devPlot, setDevPlot] = useState<Positioner.Plot | null>(null);

  const [paused, setPaused] = useState<boolean>(true);
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const pauser = () => setPaused(true);
    window.addEventListener('resize', pauser);
    return () => window.removeEventListener('resize', pauser);
  }, []);

  useEffect(() => {
    let handler: NodeJS.Timeout | undefined;
    if (paused) {
      if (ref.current === null) return;
      report.log('usePositioner', ['excuted handleResize()']);
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
      setPaused(false);
    } else {
      handler = undefined;
    }
    return () => {
      clearTimeout(handler);
      report.log('usePositioner', ['timeout cleared', paused]);
    };
  }, [paused]);

  const pose = useCallback<Positioner.Pose>((resourceMap) => {
    resourceMap.type === 'admin'
      ? setAdminPlot(
          getAdminViewPositions(
            resourceMap,
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
  }, []);

  useEffect(() => setPlot(adminPlot), [adminPlot]);
  useEffect(() => setPlot(devPlot), [devPlot]);

  return [dimensions, plot, pose, setLevel];
};
