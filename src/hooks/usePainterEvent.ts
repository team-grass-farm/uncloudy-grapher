import React, { useEffect, useRef, useState } from 'react';
import { getBoundedObject } from '~utils/positioner';

export default (
  setBoundedObject: Record<ObjectType, React.Dispatch<SelectedPosition | null>>
): [React.RefObject<HTMLCanvasElement>, SelectedPosition | null] => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState<
    Record<'width' | 'height', number>
  >({
    width: 0,
    height: 0,
  });
  const [boundedObjectPosition, setBoundedObjectPosition] =
    useState<SelectedPosition | null>(null);
  // const [positions, setPositions] = useState<Position[]>([]);

  // useEffect(() => {
  //   // console.debug(
  //   //   'gridVals: ',
  //   //   getGridPositions(dimensions.width, dimensions.height, 2)
  //   // );
  //   resetGridPositions();
  //   setPositions(getGridPositions(dimensions.width, dimensions.height, 2));
  // }, [dimensions]);

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
    const ctx = ref.current && ref.current.getContext('2d');
    if (ctx === null || ref.current === null) return;

    const handler = (el: MouseEvent) => {
      const x = el.offsetX,
        y = el.offsetY;

      // TODO Optimize getBoundedObject which varies depending on row/columns only
      const bounded = getBoundedObject(x, y);

      setBoundedObjectPosition(bounded);
      setBoundedObject['point'](bounded);
    };
    ref.current.addEventListener('mousemove', handler);
    return () =>
      ref.current
        ? ref.current.removeEventListener('mousemove', handler)
        : undefined;
  }, [dimensions]);

  return [ref, boundedObjectPosition];
};
