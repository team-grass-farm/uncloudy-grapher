import React, { useEffect, useRef, useState } from 'react';
import {
  renderGrids,
  renderLegend,
  renderObjects,
  renderPoints,
} from '~utils/painter';
import { getGridPositions, resetGridPositions } from '~utils/positioner';

export default (
  drawingType: 'grid' | 'point' | 'legend' | 'box' | 'grass' | 'node' | 'pod'
): [
  React.RefObject<HTMLCanvasElement>,
  React.Dispatch<SelectedPointPosition | null>,
  React.Dispatch<React.SetStateAction<number[][]>>,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dataChunks, updatePainter] = useState<number[][]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({
    width: 0,
    height: 0,
  });
  const [objectPositions, setObjectPositions] = useState<PointPosition[]>([]);
  const [boundedObjectPosition, setBoundedObjectPosition] =
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
        resetGridPositions();
        setObjectPositions(
          getGridPositions(dimensions.width, dimensions.height, 2)
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
          objectPositions,
          boundedObjectPosition,
          visible
        );
        return;
      default:
        renderObjects(ctx, ref.current, dataChunks, drawingType);
        return;
    }
  }, [boundedObjectPosition, dataChunks, objectPositions, visible]);

  useEffect(() => {
    !!boundedObjectPosition &&
      console.debug(`bounded ${drawingType}: `, boundedObjectPosition);
  }, [boundedObjectPosition]);

  return [ref, setBoundedObjectPosition, updatePainter, setVisible];
};
