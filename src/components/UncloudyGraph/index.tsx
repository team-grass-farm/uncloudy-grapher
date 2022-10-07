import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { usePainter, usePositioner } from '~hooks';

import { ExtrudedBlock, MainBlock } from './styles';

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
    highlighted,
    paint,
    setLevelOnPainter,
    setDimensions,
    setVisible,
  ] = usePainter();
  const [dimensions, plot, pose] = usePositioner(refMap.base);
  const [showExtruded, setShowExtruded] = useState<boolean>(false);
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

  useEffect(() => {
    !!highlighted.block && setShowExtruded(true);
  }, [highlighted]);

  return (
    <>
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
          {!!options.showPoints && !!highlighted.point && (
            <div
              id="tooltip-pos"
              style={{
                marginTop: highlighted.point.y + 15 + 'px',
                marginLeft: highlighted.point.x + 15 + 'px',
              }}
            >
              <span>{`row: ${highlighted.point.row}, col: ${highlighted.point.column}`}</span>
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
      <ExtrudedBlock hidden={!!!showExtruded}>
        <Row>
          <Col span={16}>
            <h2>파드 상세 정보</h2>
          </Col>
          <Col span={8} className="close-col">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setShowExtruded(false)}
            />
          </Col>
        </Row>
        <li>
          {highlighted.block ? JSON.stringify(highlighted.block) : 'none'}
        </li>
      </ExtrudedBlock>
    </>
  );
};
