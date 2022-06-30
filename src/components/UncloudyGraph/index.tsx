import { Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { usePainter } from '~hooks';

import { MainBlock } from './styles';

import type { Props } from './types';

type View = 'numPods' | 'CPUUsage' | 'memoryUsage' | 'nodeId';

export default ({
  id,
  clusters,
  nodes,
  deployments,
  pods,
  showGrids,
  showPoints,
  ...otherProps
}: Props) => {
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');

  const [resourceRef, updateResourcePainter] = usePainter('grid');
  const [pointRef, _p, setPointRefVisible] = usePainter('point');
  const [gridRef, _g, setGridRefVisible] = usePainter('grid');

  useEffect(() => {
    const chunks = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    updateResourcePainter(chunks);
  }, []);

  useEffect(() => {
    showPoints !== undefined && setPointRefVisible(showPoints);
  }, [showPoints]);

  useEffect(() => {
    showGrids !== undefined && setGridRefVisible(showGrids);
  }, [showGrids]);

  return (
    <MainBlock id={id} {...otherProps}>
      <canvas
        ref={resourceRef}
        id="resources"
        style={{
          marginBottom: resourceRef.current
            ? -resourceRef.current.clientHeight
            : 0,
        }}
      />
      {isDevMode && (
        <>
          <canvas
            ref={pointRef}
            id="points"
            style={{
              marginBottom: pointRef.current
                ? -pointRef.current.clientHeight
                : 0,
            }}
          />
          <canvas
            ref={gridRef}
            id="grids"
            style={{
              marginBottom: gridRef.current ? -gridRef.current.clientHeight : 0,
            }}
          />
        </>
      )}

      <aside>
        <Row id="tool-row">
          <Col span={18}></Col>
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
