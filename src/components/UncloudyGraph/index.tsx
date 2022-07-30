import { Col, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { usePainter } from '~hooks';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, panelMode, data, options, ...otherProps }: Props) => {
  const [refMap, paint, setLevel, setVisible, selectedPoint] = usePainter(
    options.level ?? 2
  );

  useEffect(() => {
    paint(panelMode, data);
  }, [data]);

  // useEffect(() => {
  //   const { clusters, nodes, pods, deployments, namespaces } = data;
  //   if (panelMode === 'admin') {
  //     setResources({ pods, nodes, clusters });
  //   } else {
  //     setResources({ pods, deployments, namespaces });
  //   }
  // }, [panelMode, data]);

  useEffect(() => {
    const { showGrids, showPoints, showBlocks, level } = options;
    setVisible({
      grid: showGrids ?? true,
      point: showPoints ?? true,
      block: showBlocks ?? true,
      group1: true,
      group2: true,
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
            marginTop: selectedPoint.y + 'px',
            marginLeft: selectedPoint.x + 'px',
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
