import React, { useEffect, useRef, useState } from 'react';

export default (drawingType: '3d'): [React.RefObject<HTMLCanvasElement>] => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dataChunks, updateDrawer] = useState<number[][]>([]);

  useEffect(() => {
    if (ref.current === null) return;

    try {
      const ctx = ref.current.getContext('webgl');

      if (ctx === null) {
        alert(
          '현재 브라우저가 WebGL을 지원하지 않아 정상적으로 표시되지 않습니다.'
        );
        return;
      }
      ctx.viewport(0, 0, ref.current.width, ref.current.height);
    } catch (e) {}
  }, [dataChunks]);

  return [ref];
};
