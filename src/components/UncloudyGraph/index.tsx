import { Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { usePainter, usePainterEvent } from '~hooks';

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
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');

  const [sampleRef, _b1, updateSamplePainter] = usePainter('box');
  const [nodeRef, b2, updateNodePainter] = usePainter('node');
  const [podRef, b3, updatePodPainter] = usePainter('pod');
  const [pointRef, b4, _p, setPointRefVisible] = usePainter(
    'point',
    options.level
  );
  const [gridRef, _b5, _g, setGridRefVisible] = usePainter('grid');
  const [eventRef, selected] = usePainterEvent(
    {
      node: b2,
      pod: b3,
      point: b4,
    },
    (options && options.level) ?? 2
  );

  useEffect(() => {
    if (panelMode === 'admin') {
      updateNodePainter(sampleChunks);
      updatePodPainter([]);
    } else {
      updateNodePainter([]);
      updatePodPainter(sampleChunks);
    }
  }, [panelMode]);

  useEffect(() => {
    updateSamplePainter(!!options.showBlocks ? sampleChunks : []);
  }, [options.showBlocks]);

  useEffect(() => {
    const { showGrids, showPoints, level } = options;
    showPoints !== undefined && setPointRefVisible(showPoints);
    showGrids !== undefined && setGridRefVisible(showGrids);
    // level !== undefined &&
  }, [options]);

  return (
    <MainBlock id={id} {...otherProps}>
      {isDevMode && (
        <>
          <canvas
            ref={gridRef}
            id="grids"
            style={{
              marginBottom: gridRef.current ? -gridRef.current.clientHeight : 0,
            }}
          />
          <canvas
            ref={pointRef}
            id="points"
            style={{
              marginBottom: pointRef.current
                ? -pointRef.current.clientHeight
                : 0,
            }}
          />
        </>
      )}
      {[sampleRef, nodeRef, podRef, eventRef].map((ref, index) => (
        <canvas
          ref={ref}
          key={'c' + index}
          id={'c' + index}
          style={{ marginBottom: ref.current ? -ref.current.clientHeight : 0 }}
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
