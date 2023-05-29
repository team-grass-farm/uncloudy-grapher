import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResourceEditor } from '~components';
import { SAMPLE_POD_JSON } from '~constants';
import { usePainter, usePositioner } from '~hooks';
import { report } from '~utils/logger';

import { ExtrudedBlock, MainBlock } from './styles';

import type { Props, ViewOption } from './types';

export default ({
  id,
  panelMode,
  data: _data,
  options,
  onRequestDetailedData,
  onClearDetailedData,
  ...otherProps
}: Props) => {
  const [
    ref,
    hoveredPoint,
    hoveredView,
    highlightedView,
    paint,
    setLevelOnPainter,
    setDimensions,
    setVisible,
  ] = usePainter();
  const [dimensions, plot, pose] = usePositioner(ref.base);
  const [viewOptions, setViewOptions] = useState<ViewOption[]>(['deployments']);

  const [savedContext, setSavedContext] = useState<
    Pick<Props, 'panelMode' | 'options'>
  >({ panelMode, options });
  const [data, setData] = useState<Resource.Map>(_data);
  useEffect(() => {
    if (data.updatedAt != _data.updatedAt) {
      report.log('UncloudyGraph', {
        msg: `render request accepted`,
        savedContext,
        data,
      });
      setData(_data);
    }
  }, [_data]);

  useEffect(() => {
    setSavedContext({ panelMode, options });
  }, [panelMode, options]);

  useEffect(() => {
    const { panelMode, options } = savedContext;

    if (!!!options.level) return;

    if (panelMode === 'admin') {
      const { pods, clusters, nodes } = data;

      pose(
        { type: panelMode, pods, nodes, clusters },
        {
          level: options.level,
          CPUUsage: viewOptions.includes('CPUUsage'),
          memoryUsage: viewOptions.includes('memoryUsage'),
        }
      );
    } else {
      pose(
        {
          type: panelMode,
          pods: data.pods,
          deployments: viewOptions.includes('deployments')
            ? data.deployments
            : undefined,
          namespaces: viewOptions.includes('namespaces')
            ? data.namespaces
            : undefined,
        },
        {
          level: options.level,
          CPUUsage: viewOptions.includes('CPUUsage'),
          memoryUsage: viewOptions.includes('memoryUsage'),
        }
      );
    }
  }, [savedContext, data]);

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
    const data = highlightedView.blocks?.data;
    if (data instanceof Map) {
      onRequestDetailedData(data.keys().next().value);
    } else if (data instanceof Object) {
      onRequestDetailedData(data.id);
    } else if (!!!data) {
      onClearDetailedData();
    }
  }, [highlightedView]);

  return (
    <>
      <MainBlock id={id} {...otherProps}>
        <section
          className={
            Object.values(hoveredView).some((val) => !!val) ? 'focused' : ''
          }
        >
          {Object.entries(ref).map(([refName, ref]) => (
            <canvas
              ref={ref}
              id={refName}
              key={'c-' + refName}
              // style={{
              //   marginBottom: ref.current ? -ref.current.clientHeight : 0,
              // }}
            />
          ))}
          {!!options.showPoints && !!hoveredPoint && (
            <div
              id="tooltip-pos"
              style={{
                marginTop: hoveredPoint.y + 15 + 'px',
                marginLeft: hoveredPoint.x + 15 + 'px',
              }}
            >
              <span>{`row: ${hoveredPoint.row}, col: ${hoveredPoint.column}`}</span>
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
                {panelMode === 'admin' && (
                  <>
                    <Select.Option key="numPods">파드 수</Select.Option>
                    <Select.Option key="nodeId">노드명</Select.Option>
                    <Select.Option key="nodes">노드 그룹</Select.Option>
                    <Select.Option key="clusters">클러스터</Select.Option>
                  </>
                )}
                {panelMode === 'dev' && (
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
      {/* <ExtrudedBlock hidden={!!!showExtruded}>
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
        <ResourceEditor
          id={'d-' + detailedData?.id}
          detailedData={detailedData}
        />
      </ExtrudedBlock> */}
    </>
  );
};
