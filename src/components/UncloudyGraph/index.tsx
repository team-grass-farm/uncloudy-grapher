import { Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { usePainter, usePositioner } from '~hooks';

import { MainBlock } from './styles';

import type { Props, ViewOption } from './types';

export default ({
  id,
  panelMode: type,
  data,
  options,
  ...otherProps
}: Props) => {
  const [
    refMap,
    selectedPoint,
    paint,
    setLevelOnPainter,
    setDimensions,
    setVisible,
  ] = usePainter();
  const [dimensions, plot, pose] = usePositioner(refMap.base);
  const [viewOptions, setViewOptions] = useState<ViewOption[]>(['deployments']);

  useEffect(() => {
    if (!!!options.level) return;

    if (type === 'admin') {
      const { pods, clusters, nodes } = data;

      pose({ type, pods, nodes, clusters }, options.level);
    } else {
      pose(
        {
          type,
          pods: data.pods,
          ...viewOptions.reduce(
            (acc, viewOption) => ({ ...acc, [viewOption]: data[viewOption] }),
            {}
          ),
        },
        options.level
      );
    }
  }, [type, options, data, viewOptions]);

  useEffect(() => (plot ? paint(plot) : undefined), [plot]);

  useEffect(() => setDimensions(dimensions), [dimensions]);

  useEffect(() => {
    const { showGrids, showPoints, showBlocks, level } = options;
    setVisible({
      grid: showGrids ?? true,
      points: showPoints ?? true,
    });
    if (level !== undefined) {
      setLevelOnPainter(level);
    }
  }, [options]);

  return (
    <MainBlock id={id} {...otherProps}>
      <section>
        {Object.entries(refMap).map(([refName, ref]) => (
          <canvas
            ref={ref}
            id={refName}
            key={'c-' + refName}
            // style={{
            //   marginBottom: ref.current ? -ref.current.clientHeight : 0,
            // }}
          />
        ))}
        {!!options.showPoints && !!selectedPoint && (
          <div
            id="tooltip-pos"
            style={{
              marginTop: selectedPoint.y + 15 + 'px',
              marginLeft: selectedPoint.x + 15 + 'px',
            }}
          >
            <span>{`row: ${selectedPoint.row}, col: ${selectedPoint.column}`}</span>
          </div>
        )}
      </section>

      <aside>
        <Row
          id="tool-row"
          style={{
            flexDirection: 'row-reverse',
          }}
        >
          <Col span={6}>
            <Select<ViewOption[]>
              mode="multiple"
              value={viewOptions}
              onChange={setViewOptions}
              style={{ width: '100%' }}
              placeholder="보기 설정"
              maxTagCount="responsive"
            >
              <Select.Option key="CPUUsage">CPU 점유율</Select.Option>
              <Select.Option key="memoryUsage">메모리 점유율</Select.Option>
              {type === 'admin' && (
                <>
                  <Select.Option key="numPods">파드 수</Select.Option>
                  <Select.Option key="nodeId">노드명</Select.Option>
                  <Select.Option key="nodes">노드 그룹</Select.Option>
                  <Select.Option key="clusters">클러스터</Select.Option>
                </>
              )}
              {type === 'dev' && (
                <>
                  <Select.Option key="deployments">배포 그룹</Select.Option>
                  <Select.Option key="namespaces">네임스페이스</Select.Option>
                </>
              )}
            </Select>
          </Col>
        </Row>
      </aside>
    </MainBlock>
  );
};
