import { useCallback, useEffect, useRef, useState } from 'react';
import { report } from '~utils/logger';
import { getCursorPosition } from '~utils/positioner';
import { IsSameMatrix } from '~utils/typeChecker';

export default (
  dimensions: Record<'width' | 'height', number>
): [
  React.RefObject<HTMLCanvasElement>,
  number,
  Painter.SavedView,
  Painter.SavedShrankViews,
  Painter.SavedViews,
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

  const [hoveredView, setHoveredView] = useState<Painter.SavedView>({
    block: null,
    group1: null,
    group2: null,
  });
  const [shrankViews, setShrankViews] = useState<Painter.SavedShrankViews>({
    curtain1: { blocks: null, groups1: null, groups2: null },
    curtain2: { blocks: null, groups1: null, groups2: null },
    pillar: { blocks: null, groups1: null, groups2: null },
  });
  const [highlightedViews, setHighlightedViews] = useState<Painter.SavedViews>({
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

  const getBlockPositionFromMatrix = (
    matrix: PointMatrix | BlockMatrix
  ): BlockPosition | null => {
    const blockPosition =
      renderedPlot?.blocks.data.get(matrix.row + ',' + matrix.column) ?? null;
    return !!blockPosition
      ? {
          ...blockPosition,
          x: blockPosition.x + perspective,
          y: blockPosition.y - perspective * 0.57,
        }
      : null;
  };

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      const point = getPointPositionFromEvent(ev);

      if (!IsSameMatrix(point, highlightedPointPosition)) {
        if (!!point && !!renderedPlot) {
          const { blocks } = renderedPlot;
          const hoveredKind = blocks.objectKind;
          // const hoveredData =
          //   blocks.data.get(point!.row + ',' + point!.column) ?? null;
          const hoveredData = getBlockPositionFromMatrix(point);

          report.debug('usePainterEvent', {
            msg: 'onHandleClick()',
            blocks,
            hoveredData,
          });

          setHighlightedViews({
            blocks: !!hoveredData
              ? {
                  ...blocks,
                  objectKind: hoveredKind,
                  data: hoveredData,
                }
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
          const objectKind = blocks.objectKind;
          // const hoveredData =
          //   blocks.data.get(point.row + ',' + point.column) ?? null;
          // if (!!hoveredData) {
          //   hoveredData.x = hoveredData.x + perspective;
          //   hoveredData.y = hoveredData.y - perspective * 0.57;
          // }
          const hoveredData = getBlockPositionFromMatrix(point);

          const curtain1Data = new Map(
            (
              [
                { row: point.row - 1, column: point.column + 1 },
              ] as PointMatrix[]
            )
              .map((p): [string, BlockPosition | null] => {
                return [p.row + ',' + p.column, getBlockPositionFromMatrix(p)];
              })
              .filter((datum): datum is [string, BlockPosition] => !!datum[1])
          );
          const pillarData = new Map(
            (
              [
                { row: point.row - 2, column: point.column + 2 },
              ] as PointMatrix[]
            )
              .map((p): [string, BlockPosition | null] => {
                return [p.row + ',' + p.column, getBlockPositionFromMatrix(p)];
              })
              .filter((datum): datum is [string, BlockPosition] => !!datum[1])
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
            setShrankViews({
              curtain1: {
                blocks:
                  curtain1Data.size > 0
                    ? {
                        ...blocks,
                        objectKind,
                        data: curtain1Data,
                      }
                    : null,
                groups1: null,
                groups2: null,
              },
              curtain2: {
                blocks: null,
                groups1: null,
                groups2: null,
              },
              pillar: {
                blocks:
                  pillarData.size > 0
                    ? {
                        ...blocks,
                        objectKind,
                        data: pillarData,
                      }
                    : null,
                groups1: null,
                groups2: null,
              },
            });
          } else {
            setShrankViews({
              curtain1: {
                blocks: null,
                groups1: null,
                groups2: null,
              },
              curtain2: {
                blocks: null,
                groups1: null,
                groups2: null,
              },
              pillar: {
                blocks: null,
                groups1: null,
                groups2: null,
              },
            });
          }
          setHoveredView({
            block: !!hoveredData
              ? { ...blocks, objectKind, data: hoveredData }
              : null,
            group1: null,
            group2: null,
          });
        } else {
          // setHoveredView({
          //   block: null,
          //   group1: null,
          //   group2: null,
          // });
          // setShrinkedPositions({
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
    setHoveredView({
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
    hoveredView,
    shrankViews,
    highlightedViews,
    hoveredPointPosition,
    setLevel,
    setRenderedPlot,
  ];
};
