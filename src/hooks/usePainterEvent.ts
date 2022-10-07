import { useCallback, useEffect, useRef, useState } from 'react';
import { report } from '~utils/logger';
import { getCursorPosition } from '~utils/positioner';

export default (
  dimensions: Record<'width' | 'height', number>
): [
  React.RefObject<HTMLCanvasElement>,
  number,
  PointPosition | null,
  PointPosition | null,
  React.Dispatch<1 | 2 | 3>
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [hoveredPointPosition, setHoveredPointPosition] =
    useState<PointPosition | null>(null);
  const [highlightedPointPosition, setHighlightedPointPosition] =
    useState<PointPosition | null>(null);
  const [perspective, setPerspective] = useState<number>(0);
  const [wheelEvent, setWheelEvent] = useState<WheelEvent | null>(null);

  const ref = useRef<HTMLCanvasElement>(null);

  const getPointPosition = (ev: MouseEvent): PointPosition | null => {
    const x = ev.offsetX,
      y = ev.offsetY;

    return getCursorPosition(
      dimensions.width,
      dimensions.height,
      level,
      x,
      y,
      perspective,
      1
    );
  };

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      setHighlightedPointPosition(getPointPosition(ev));
    },
    [dimensions, level, perspective]
  );

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      setHoveredPointPosition(getPointPosition(ev));
    },
    [dimensions, level, perspective]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPointPosition(null);
  }, []);

  const handleWheel = useCallback((ev: WheelEvent) => {
    ev.preventDefault();
    setWheelEvent(ev);
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

    ref.current.addEventListener('click', handleClick);
    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    ref.current.addEventListener('wheel', (ev) => handleWheel(ev));

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('click', handleClick);
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
        ref.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [dimensions, level, perspective]);

  useEffect(() => {
    !!hoveredPointPosition &&
      report.debug('usePainterEvent', [
        'level: ',
        level,
        'boundedEvent: ',
        hoveredPointPosition,
      ]);
  }, [hoveredPointPosition]);

  return [
    ref,
    perspective,
    hoveredPointPosition,
    highlightedPointPosition,
    setLevel,
  ];
};
