import { useCallback, useEffect, useRef, useState } from 'react';
import { report } from '~utils/logger';
import { getCursorPosition } from '~utils/positioner';

const IsSameMatrix = (a: Matrix | null, b: Matrix | null): boolean =>
  !!a && !!b && a.row === b.row && a.column === b.column;

export default (
  dimensions: Record<'width' | 'height', number>
): [
  React.RefObject<HTMLCanvasElement>,
  number,
  Painter.Position,
  Painter.Positions,
  Painter.Positions,
  PointPosition | null,
  React.Dispatch<1 | 2 | 3>,
  React.Dispatch<Positioner.Plot | null>
] => {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [perspective, setPerspective] = useState<number>(0);
  const [renderedPlot, setRenderedPlot] = useState<Positioner.Plot | null>(
    null
  );

  const [hoveredPointPosition, setHoveredPointPosition] =
    useState<PointPosition | null>(null);
  const [highlightedPointPosition, setHighlightedPointPositions] =
    useState<PointPosition | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<Painter.Position>({
    matrix: null,
    block: null,
    group1: null,
    group2: null,
  });
  const [shrinkedPositions, setShrinkedPositions] = useState<Painter.Positions>(
    {
      matrix: null,
      blocks: null,
      groups1: null,
      groups2: null,
    }
  );
  const [highlightedPositions, setHighlightedPositions] =
    useState<Painter.Positions>({
      matrix: null,
      blocks: null,
      groups1: null,
      groups2: null,
    });

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
      const point = getPointPosition(ev);

      testHandling();

      if (!IsSameMatrix(point, highlightedPointPosition)) {
        if (!!point && !!renderedPlot) {
          const { blocks } = renderedPlot;
          const targetBlockData =
            blocks.data.get(point!.row + ',' + point!.column) ?? null;

          report.debug('usePainterEvent', [
            {
              msg: 'onHandleClick()',
              blocks,
              targetBlockData,
            },
          ]);

          setHighlightedPositions({
            matrix: null,
            blocks: !!targetBlockData
              ? ({ ...blocks, data: targetBlockData } as BlockPosition)
              : null,
            groups1: null,
            groups2: null,
          });
        } else {
          report.log('usePainterEvent', [
            {
              msg: 'one of point & renderedPlot does not exist',
              point,
              renderedPlot,
            },
          ]);
        }
      } else {
        report.log('usePainterEvent', [{ msg: 'not same onHandleClick()' }]);
      }
      setHighlightedPointPositions(point);
    },
    [dimensions, level, perspective, renderedPlot, highlightedPointPosition]
  );

  useEffect(() => {
    report.log('usePainterEvent', [
      { msg: 'renderedPlot changed.', renderedPlot },
    ]);
    testHandling();
  }, [renderedPlot]);

  const testHandling = useCallback(() => {
    report.log('usePainterEvent', [{ msg: 'testHandling()', renderedPlot }]);
  }, [renderedPlot]);

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      const point = getPointPosition(ev);

      if (!IsSameMatrix(point, highlightedPointPosition)) {
        if (!!point && !!renderedPlot) {
          const { blocks } = renderedPlot;
          const targetBlockData =
            blocks.data.get(point.row + ',' + point.column) ?? null;
          const forwardIndexes = [point.row - 1 + ',' + (point.column + 1)];
          const forwardBlockData = new Map(
            forwardIndexes
              .map((strIndex): [string, any] => {
                return [strIndex, blocks.data.get(strIndex) ?? null];
              })
              .filter((datum) => !!datum[1])
          );

          report.debug('usePainterEvent', [
            {
              msg: 'onHandleMouseMove()',
              point,
              blocks,
              targetBlockData,
              forwardBlockData,
            },
          ]);

          setHoveredPosition({
            matrix: null,
            block: !!targetBlockData
              ? ({ ...blocks, data: targetBlockData } as BlockPosition)
              : null,
            group1: null,
            group2: null,
          });
          setShrinkedPositions({
            matrix: null,
            blocks:
              forwardBlockData.size > 0
                ? ({ ...blocks, data: forwardBlockData } as BlockPositions)
                : null,
            groups1: null,
            groups2: null,
          });
        }
      }
      setHoveredPointPosition(point);
    },
    [dimensions, level, perspective, renderedPlot, hoveredPointPosition]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPosition({
      matrix: null,
      block: null,
      group1: null,
      group2: null,
    });
  }, []);

  const handleWheel = useCallback(
    (ev: WheelEvent) => {
      ev.preventDefault();
      setPerspective(Math.min(0, perspective + ev.deltaX + ev.deltaY));
    },
    [perspective]
  );

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!!!ctx || ref.current === null) return;

    ref.current.addEventListener('click', handleClick);
    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    ref.current.addEventListener('wheel', handleWheel);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('click', handleClick);
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
        ref.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [dimensions, level, perspective]);

  return [
    ref,
    perspective,
    hoveredPosition,
    shrinkedPositions,
    highlightedPositions,
    hoveredPointPosition,
    setLevel,
    setRenderedPlot,
  ];
};
