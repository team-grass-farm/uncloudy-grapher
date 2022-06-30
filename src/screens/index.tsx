import { Alert, Button, Cascader, Col, DatePicker, Row, Segmented, Space, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DevelopmentOnlyAlert, UncloudyGraph } from '~components';
import { SAMPLE_NODES, SAMPLE_PODS } from '~constants';
import { getFilteringOptions } from '~utils/fetcher';

import { BarChartOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons';

import { MainBlock } from './styles';

import type { Page } from '~models';
export default () => {
  const [panel, setPanel] = useState<'dev' | 'admin'>('dev');
  const [options, setOptions] = useState<Page.Option[]>([]);
  const [showGrids, setShowGrids] = useState<boolean>(true);
  const [showPoints, setShowPoints] = useState<boolean>(true);

  useEffect(() => {
    setOptions(getFilteringOptions(panel));
  }, [panel]);

  return (
    <MainBlock>
      <header>
        <Row id="title-row" gutter={[10, 20]}>
          <Col span={24} sm={12}>
            <BarChartOutlined />
            Uncloudy Grapher
          </Col>
          <Col className="panel-col" span={24} sm={12}>
            <Segmented
              value={panel}
              onChange={(value) => setPanel(value as 'dev' | 'admin')}
              options={[
                {
                  label: '개발자 패널',
                  value: 'dev',
                  icon: <CodeOutlined />,
                },
                {
                  label: '관리자 패널',
                  value: 'admin',
                  icon: <ToolOutlined />,
                },
              ]}
            />
          </Col>
        </Row>
        <Row id="option-row" gutter={[10, 10]}>
          <Col span={24} sm={16}>
            <Cascader
              style={{
                width: '100%',
              }}
              defaultValue={[]}
              placeholder={
                '특정 ' +
                (panel === 'dev'
                  ? '파드 또는 디플로이먼트'
                  : '노드 또는 클러스터') +
                ' 필터링...'
              }
              options={options}
              multiple
              showCheckedStrategy={Cascader.SHOW_PARENT}
            />
          </Col>
          <Col span={24} sm={8}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              showTime
              placeholder={['시작일', '종료일']}
              onChange={(val) => {
                console.log('val: ', val);
              }}
              defaultValue={[
                moment(new Date()).subtract(15, 'minutes'),
                moment(new Date()),
              ]}
            />
          </Col>
        </Row>
      </header>
      <main>
        <UncloudyGraph
          nodes={SAMPLE_NODES}
          pods={SAMPLE_PODS}
          showGrids={showGrids}
          showPoints={showPoints}
        />
        <DevelopmentOnlyAlert
          showGrids={showGrids}
          showPoints={showPoints}
          onChangeShowGrids={setShowGrids}
          onChangeShowPoints={setShowPoints}
        />
      </main>
    </MainBlock>
  );
};
