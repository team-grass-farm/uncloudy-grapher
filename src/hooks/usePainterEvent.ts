import { useCallback, useEffect, useRef, useState } from 'react';
import { report } from '~utils/logger';
import { getCursorPosition } from '~utils/positioner';
import { IsSameMatrix } from '~utils/typeChecker';

export default (
  dimensions: Record<'width' | 'height', number>
): [
  React.RefObject<HTMLCanvasElement>,
  number,
  Painter.Position,
  Painter.ShrankPositions,
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
  const [highlightedPointPosition, setHighlightedPointPosition] =
    useState<PointPosition | null>(null);

  const [hoveredPosition, setHoveredPosition] = useState<Painter.Position>({
    matrix: null,
    block: null,
    group1: null,
    group2: null,
  });
  const [shrankPositions, setShrankPositions] =
    useState<Painter.ShrankPositions>({
      curtain1: { matrix: null, blocks: null, groups1: null, groups2: null },
      curtain2: { matrix: null, blocks: null, groups1: null, groups2: null },
      pillar: { matrix: null, blocks: null, groups1: null, groups2: null },
    });

  const [highlightedPositions, setHighlightedPositions] =
    useState<Painter.Positions>({
      matrix: null,
      blocks: null,
      groups1: null,
      groups2: null,
    });

  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [supportsPassive, setSupportsPassive] = useState(false);

  const ref = useRef<HTMLCanvasElement>(null);

  const getPointPositionFromEvent = (ev: MouseEvent): PointPosition | null => {
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

  const getBlockPositionsFromMatrix = (
    matrix: Matrix
  ): PointPosition | null => {
    const point =
      renderedPlot?.blocks.data.get(matrix.row + ',' + matrix.column) ?? null;
    return !!point
      ? {
          ...point,
          x: point.x + perspective,
          y: point.y - perspective * 0.57,
        }
      : null;
  };

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      const point = getPointPositionFromEvent(ev);

      if (!IsSameMatrix(point, highlightedPointPosition)) {
        if (!!point && !!renderedPlot) {
          const { blocks } = renderedPlot;
          const hoveredKind = blocks.kind.slice(0, -1) as BlockKind;
          // const hoveredData =
          //   blocks.data.get(point!.row + ',' + point!.column) ?? null;
          const hoveredData = getBlockPositionsFromMatrix(point);

          report.debug('usePainterEvent', {
            msg: 'onHandleClick()',
            blocks,
            hoveredData,
          });

          setHighlightedPositions({
            matrix: null,
            blocks: !!hoveredData
              ? ({
                  ...blocks,
                  kind: hoveredKind,
                  data: hoveredData,
                } as BlockPosition)
              : null,
            groups1: null,
            groups2: null,
          });
        } else {
          report.log('usePainterEvent', {
            msg: 'one of point & renderedPlot does not exist',
            point,
            renderedPlot,
          });
        }
        setHighlightedPointPosition(point);
      } else {
        report.log('usePainterEvent', {
          msg: 'already executed block onHandleClick()',
        });
      }
    },
    [dimensions, level, perspective, renderedPlot, highlightedPointPosition]
  );

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (Math.abs(ev.movementX * ev.movementY) > 10) return;

      const point = getPointPositionFromEvent(ev);
      setIsMouseMoving(true);

      if (!IsSameMatrix(point, hoveredPointPosition)) {
        if (!!point && !!renderedPlot) {
          const { blocks } = renderedPlot;
          const kind = blocks.kind.slice(0, -1) as BlockKind;
          // const hoveredData =
          //   blocks.data.get(point.row + ',' + point.column) ?? null;
          // if (!!hoveredData) {
          //   hoveredData.x = hoveredData.x + perspective;
          //   hoveredData.y = hoveredData.y - perspective * 0.57;
          // }
          const hoveredData = getBlockPositionsFromMatrix(point);

          const curtain1Data = new Map(
            ([{ row: point.row - 1, column: point.column + 1 }] as Matrix[])
              .map((p): [string, PointPosition | null] => {
                return [p.row + ',' + p.column, getBlockPositionsFromMatrix(p)];
              })
              .filter((datum): datum is [string, PointPosition] => !!datum[1])
          );
          const pillarData = new Map(
            ([{ row: point.row - 2, column: point.column + 2 }] as Matrix[])
              .map((p): [string, PointPosition | null] => {
                return [p.row + ',' + p.column, getBlockPositionsFromMatrix(p)];
              })
              .filter((datum): datum is [string, PointPosition] => !!datum[1])
          );

          // report.debug('usePainterEvent', [
          //   {
          //     msg: 'onHandleMouseMove()',
          //     point,
          //     hoveredPointPosition,
          //     blocks,
          //     hoveredData,
          //     curtain1Data,
          //   },
          // ]);

          if (!!hoveredData && !!curtain1Data.size) {
            setShrankPositions({
              curtain1: {
                matrix: null,
                blocks:
                  curtain1Data.size > 0
                    ? ({
                        ...blocks,
                        kind: blocks.kind,
                        data: curtain1Data,
                      } as BlockPositions)
                    : null,
                groups1: null,
                groups2: null,
              },
              curtain2: {
                matrix: null,
                blocks: null,
                groups1: null,
                groups2: null,
              },
              pillar: {
                matrix: null,
                blocks:
                  pillarData.size > 0
                    ? ({
                        ...blocks,
                        kind: blocks.kind,
                        data: pillarData,
                      } as BlockPositions)
                    : null,
                groups1: null,
                groups2: null,
              },
            });
          } else {
            setShrankPositions({
              curtain1: {
                matrix: null,
                blocks: null,
                groups1: null,
                groups2: null,
              },
              curtain2: {
                matrix: null,
                blocks: null,
                groups1: null,
                groups2: null,
              },
              pillar: {
                matrix: null,
                blocks: null,
                groups1: null,
                groups2: null,
              },
            });
          }
          setHoveredPosition({
            matrix: null,
            block: !!hoveredData
              ? ({ ...blocks, kind, data: hoveredData } as BlockPosition)
              : null,
            group1: null,
            group2: null,
          });
        } else {
          // setHoveredPosition({
          //   matrix: null,
          //   block: null,
          //   group1: null,
          //   group2: null,
          // });
          // setShrinkedPositions({
          //   matrix: null,
          //   blocks: null,
          //   groups1: null,
          //   groups2: null,
          // });
        }

        setHoveredPointPosition(point);
      }
      setIsMouseMoving(false);
    },
    [renderedPlot, hoveredPointPosition]
  );

  const handleMouseLeave = useCallback(() => {
    report.debug('usePainterEvent', { msg: 'leaving' });
    setHoveredPosition({
      matrix: null,
      block: null,
      group1: null,
      group2: null,
    });
  }, []);

  const handleWheel = useCallback(
    (ev: WheelEvent) => {
      !supportsPassive && ev.preventDefault();
      const newPerspective = Math.min(0, perspective - (ev['wheelDelta'] >> 1));
      report.debug('usePainterEvent', {
        msg: `perspective: ${newPerspective}`,
        ev,
        delta: ev['wheelDelta'],
      });
      setPerspective(newPerspective);
    },
    [perspective, supportsPassive]
  );

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.current!.removeEventListener('mousemove', handleMouseMove);
      ref.current!.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dimensions, level, renderedPlot, hoveredPointPosition, isMouseMoving]);

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.addEventListener('click', handleClick);

    return () => ref.current!.removeEventListener('click', handleClick);
  }, [dimensions, level, renderedPlot, highlightedPointPosition]);

  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
  useEffect(() => {
    // Test via a getter in the options object to see if the passive property is accessed
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function () {
          setSupportsPassive(true);
        },
      });
      window.addEventListener('testPassive', () => {}, opts);
      window.removeEventListener('testPassive', () => {}, opts);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.addEventListener(
      'wheel',
      handleWheel,
      supportsPassive ? { passive: true } : false
    );

    return () => ref.current!.removeEventListener('wheel', handleWheel);
  }, [dimensions, level, perspective, supportsPassive]);

  return [
    ref,
    perspective,
    hoveredPosition,
    shrankPositions,
    highlightedPositions,
    hoveredPointPosition,
    setLevel,
    setRenderedPlot,
  ];
};
