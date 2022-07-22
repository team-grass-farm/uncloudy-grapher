import React, { useEffect, useRef, useState } from 'react';
import { renderGrids, renderLegend, renderObjects, renderPoints } from '~utils/painter';
import { getPointPositions, resetPointPositions } from '~utils/positioner';

export default (
  drawingType: 'grid' | 'point' | 'legend' | 'box' | 'grass' | 'node' | 'pod',
  level?: 1 | 2 | 3
): [
  React.RefObject<HTMLCanvasElement>,
  React.Dispatch<SelectedPointPosition | null>,
  React.Dispatch<React.SetStateAction<number[][]>>,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dataChunks, setDataChunks] = useState<number[][]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({
    width: 0,
    height: 0,
  });
  const [pointPositions, setPointPositions] = useState<PointPosition[]>([]);
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

  useEffect(() => {
    switch (drawingType) {
      case 'point':
        resetPointPositions();
        setPointPositions(
          getPointPositions(dimensions.width, dimensions.height, level ?? 2)
        );
        break;
    }
  }, [dimensions]);

  useEffect(() => {
    const ctx = ref.current && ref.current.getContext('2d');
    if (ctx === null || ref.current === null) return;

    switch (drawingType) {
      case 'legend':
        renderLegend(ctx, ref.current, dataChunks, ['day', 'month']);
        return;
      case 'grid':
        renderGrids(ctx, ref.current, visible);
        return;
      case 'point':
        renderPoints(
          ctx,
          ref.current,
          pointPositions,
          highlightedPointPosition,
          visible
        );
        return;
      default:
        renderObjects(ctx, ref.current, dataChunks, drawingType);
        return;
    }
  }, [highlightedPointPosition, dataChunks, pointPositions, visible]);

  useEffect(() => {
    !!highlightedPointPosition &&
      console.debug(`bounded ${drawingType}: `, highlightedPointPosition);
  }, [highlightedPointPosition]);

  return [ref, setHighlightedPointPosition, setDataChunks, setVisible];
};
