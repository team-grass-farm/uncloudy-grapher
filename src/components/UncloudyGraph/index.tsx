import { Col, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { usePainter, usePositioner } from '~hooks';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, panelMode, data, options, ...otherProps }: Props) => {
  const [refMap, level, paint, setLevel, setVisible, selectedPoint] =
    usePainter(options.level ?? 2);
  const [dimensions, plot, pose] = usePositioner(
    options.level ?? 2,
    refMap.main
  );

  useEffect(() => {
    if (panelMode === 'admin') {
      const { pods, clusters, nodes } = data;
      pose({ type: panelMode, pods, nodes, clusters });
    } else {
      const { pods, deployments, namespaces } = data;
      pose({ type: panelMode, pods, deployments, namespaces });
    }
  }, [panelMode, level, data]);

  useEffect(() => (plot ? paint(plot) : undefined), [plot]);

  useEffect(() => {
    const { showGrids, showPoints, showBlocks, level } = options;
    setVisible({
      grid: showGrids ?? true,
      points: showPoints ?? true,
      main: true,
      blocks: showBlocks ?? true,
      groups1: true,
      groups2: true,
    });
    level !== undefined && setLevel(level);
  }, [options]);

  return (
    <MainBlock id={id} {...otherProps}>
      {Object.entries(refMap).map(([refName, ref]) => (
        <canvas
          ref={ref}
          id={refName}
          key={'c-' + refName}
          style={{
            marginBottom: ref.current ? -ref.current.clientHeight : 0,
          }}
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

      <aside>
        <Row
          id="tool-row"
          style={{
            flexDirection: 'row-reverse',
          }}
        >
          <Col span={6}>
            <Select
              mode="multiple"
              onChange={(value) => console.log('value: ', value)}
              style={{ width: '100%' }}
              placeholder="보기 설정"
              maxTagCount="responsive"
            >
              <Select.Option key="numPods">파드 수</Select.Option>
              <Select.Option key="CPUUsage">CPU 점유율</Select.Option>
              <Select.Option key="memoryUsage">메모리 점유율</Select.Option>
              <Select.Option key="nodeId">노드명</Select.Option>
            </Select>
          </Col>
        </Row>
      </aside>
    </MainBlock>
  );
};
