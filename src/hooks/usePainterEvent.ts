import React, { useEffect, useRef, useState } from 'react';
import { getHighlightedPointPosition } from '~utils/positioner';

export default (
  dimensions: Record<'width' | 'height', number>,
  _level: 1 | 2 | 3
): [
  React.RefObject<HTMLCanvasElement>,
  React.Dispatch<1 | 2 | 3>,
  SelectedPointPosition | null
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(_level);
  const [highlightedPointPosition, setHighlightedPointPosition] =
    useState<SelectedPointPosition | null>(null);

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current && ref.current.getContext('2d');
    if (ctx === null || ref.current === null) return;

    const handler = (el: MouseEvent) => {
      const x = el.offsetX,
        y = el.offsetY;

      const bounded = getHighlightedPointPosition(
        dimensions.width,
        dimensions.height,
        level,
        x,
        y
      );

      setHighlightedPointPosition(bounded);
    };

    ref.current.addEventListener('mousemove', handler);
    return () =>
      ref.current
        ? ref.current.removeEventListener('mousemove', handler)
        : undefined;
  }, [dimensions, level]);

  useEffect(() => {
    !!highlightedPointPosition &&
      console.debug(
        `[usePainterEvent] level: ${level}, bounded event: `,
        highlightedPointPosition
      );
  }, [highlightedPointPosition]);

  return [ref, setLevel, highlightedPointPosition];
};
