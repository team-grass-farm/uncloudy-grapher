import { Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { usePainter } from '~hooks';

import { MainBlock } from './styles';

import type { Props } from './types';

const sampleChunks = [
  [1, 2, 3],
  [4, 5, 6],
];

export default ({
  id,
  panelMode,
  clusters,
  nodes,
  deployments,
  pods,
  options,
  ...otherProps
}: Props) => {
  const [refMap, setLevel, setResources, setVisible, selected] = usePainter(
    options.level ?? 2
  );

  useEffect(() => {
    if (panelMode === 'admin') {
      setResources({
        node: sampleChunks,
      });
    } else {
      setResources({
        pod: sampleChunks,
      });
    }
  }, [panelMode]);

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
      {!!options.showPoints && !!selected && (
        <div
          id="tooltip-pos"
          style={{
            marginTop: selected.y + 'px',
            marginLeft: selected.x + 'px',
          }}
        >
          <span>{`row: ${selected.row}, col: ${selected.column}`}</span>
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
