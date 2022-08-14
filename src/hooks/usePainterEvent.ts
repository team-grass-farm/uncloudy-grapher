import { useEffect, useRef, useState } from 'react';
import { report } from '~utils/logger';
import { getCursorPosition } from '~utils/positioner';

export default (
  dimensions: Record<'width' | 'height', number>
): [
  React.RefObject<HTMLCanvasElement>,
  PointPosition | null,
  BlockPositions | null,
  React.Dispatch<1 | 2 | 3>
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [highlightedPointPosition, setHighlightedPointPosition] =
    useState<PointPosition | null>(null);
  const [highlightedBlockPositions, setHighlightedBlockPositions] =
    useState<BlockPositions | null>(null);

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current && ref.current.getContext('2d');
    if (ctx === null || ref.current === null) return;

    const handleMouseMove = (el: MouseEvent) => {
      const x = el.offsetX,
        y = el.offsetY;

      const bounded = getCursorPosition(
        dimensions.width,
        dimensions.height,
        level,
        x,
        y,
        1
      );

      setHighlightedPointPosition(bounded);
      // setHighlightedBlockPositions(bounded);
    };

    const handleMouseLeave = () => {
      setHighlightedPointPosition(null);
      setHighlightedBlockPositions(null);
    };

    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [dimensions, level]);

  useEffect(() => {
    !!highlightedPointPosition &&
      report.debug('usePainterEvent', [
        'level: ',
        level,
        'boundedEvent: ',
        highlightedPointPosition,
      ]);
  }, [highlightedPointPosition]);

  return [ref, highlightedPointPosition, highlightedBlockPositions, setLevel];
};
