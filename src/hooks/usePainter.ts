import React, { useEffect, useRef, useState } from 'react';
import { renderGrid, renderLegend, renderObject, renderPoint } from '~utils/painter';

export default (
  drawingType: 'grid' | 'point' | 'legend' | 'box' | 'grass'
): [
  React.RefObject<HTMLCanvasElement>,
  React.Dispatch<React.SetStateAction<number[][]>>,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dataChunks, updatePainter] = useState<number[][]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.width = ref.current.clientWidth;
    ref.current.height = ref.current.clientHeight;
  }, [ref]);

  useEffect(() => {
    const ctx = ref.current && ref.current.getContext('2d');
    if (ctx === null || ref.current === null) return;

    switch (drawingType) {
      case 'legend':
        renderLegend(ctx, ref.current, dataChunks, ['day', 'month']);
        return;
      case 'grid':
        renderGrid(ctx, ref.current, visible);
        return;
      case 'point':
        renderPoint(ctx, ref.current, visible);
        return;
      default:
        renderObject(ctx, ref.current, dataChunks, drawingType);
        return;
    }
  }, [dataChunks, visible]);

  return [ref, updatePainter, setVisible];
};
