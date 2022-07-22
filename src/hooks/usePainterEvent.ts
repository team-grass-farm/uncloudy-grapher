import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getHighlightedPointPosition } from '~utils/positioner';

export default (
  setter: Record<PointType, React.Dispatch<SelectedPointPosition | null>>,
  level: 1 | 2 | 3
): [React.RefObject<HTMLCanvasElement>, SelectedPointPosition | null] => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({
    width: 0,
    height: 0,
  });
  const [highlightedPointPosition, setHighlightedPointPosition] =
    useState<SelectedPointPosition | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current === null) return;
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
      ref.current.width = ref.current.clientWidth;
      ref.current.height = ref.current.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handler = useCallback(
    (el: MouseEvent) => {
      const x = el.offsetX,
        y = el.offsetY;

      // TODO Optimize getHighlightedPointPosition which varies depending on row/columns only
      const bounded = getHighlightedPointPosition(
        dimensions.width,
        dimensions.height,
        level,
        x,
        y
      );

      setHighlightedPointPosition(bounded);
      setter.point(bounded);
    },
    [dimensions]
  );

  useEffect(() => {
    const ctx = ref.current && ref.current.getContext('2d');
    if (ctx === null || ref.current === null) return;

    ref.current.addEventListener('mousemove', handler);
    return () =>
      ref.current
        ? ref.current.removeEventListener('mousemove', handler)
        : undefined;
  }, [dimensions]);

  return [ref, highlightedPointPosition];
};
