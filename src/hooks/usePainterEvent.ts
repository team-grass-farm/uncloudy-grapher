import { useCallback, useEffect, useRef, useState } from 'react';
import { report } from '~utils/logger';
import { getCursorPosition } from '~utils/positioner';

export default (
  dimensions: Record<'width' | 'height', number>
): [
  React.RefObject<HTMLCanvasElement>,
  number,
  PointPosition | null,
  React.Dispatch<1 | 2 | 3>
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [highlightedPointPosition, setHighlightedPointPosition] =
    useState<PointPosition | null>(null);
  const [perspective, setPerspective] = useState<number>(0);
  const [wheelEvent, setWheelEvent] = useState<WheelEvent | null>(null);

  const ref = useRef<HTMLCanvasElement>(null);

  const handleWheel = useCallback((ev: WheelEvent) => {
    ev.preventDefault();
    setWheelEvent(ev);
  }, []);

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      const x = ev.offsetX,
        y = ev.offsetY;

      const bounded = getCursorPosition(
        dimensions.width,
        dimensions.height,
        level,
        x,
        y,
        perspective,
        1
      );

      setHighlightedPointPosition(bounded);
    },
    [dimensions, level, perspective]
  );

  const handleMouseLeave = useCallback(() => {
    setHighlightedPointPosition(null);
  }, []);

  useEffect(() => {
    wheelEvent &&
      setPerspective(
        Math.min(0, perspective + wheelEvent.deltaX + wheelEvent.deltaY)
      );
  }, [wheelEvent]);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!!!ctx || ref.current === null) return;

    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    ref.current.addEventListener('wheel', (ev) => handleWheel(ev));

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
        ref.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [dimensions, level, perspective]);

  useEffect(() => {
    !!highlightedPointPosition &&
      report.debug('usePainterEvent', [
        'level: ',
        level,
        'boundedEvent: ',
        highlightedPointPosition,
      ]);
  }, [highlightedPointPosition]);

  return [ref, perspective, highlightedPointPosition, setLevel];
};
