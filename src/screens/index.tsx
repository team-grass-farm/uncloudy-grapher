import { Cascader, Col, DatePicker, Row, Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import React, { useEffect, useState } from 'react';
import { ContributeGraph } from '~components';

import { BarChartOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons';

import { MainBlock } from './styles';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const adminOptions: Option[] = [
  {
    value: 'seoulb01',
    label: '서울',
    children: [
      { value: 'seoulb01', label: 'seoulb01' },
      { value: 'seoulm01', label: 'seoulm01' },
      { value: 'seoulm02', label: 'seoulm02' },
    ],
  },
  {
    value: 'busanb01',
    label: '부산',
    children: [
      { value: 'busanb01', label: 'busanb01' },
      { value: 'busanm01', label: 'busanm01' },
      { value: 'busanm02', label: 'busanm02' },
    ],
  },
];

const devOptions: Option[] = [
  {
    value: 'zandi-backend',
    label: 'zandi-backend',
    children: [
      {
        value: 'swagger',
        label: 'swagger',
        children: [
          {
            value: 'swagger-deployment-1771418926-7o5ns',
            label: 'swagger-deployment-1771418926-7o5ns',
          },
          {
            value: 'swagger-deployment-1771418926-r18az',
            label: 'swagger-deployment-1771418926-r18az',
          },
        ],
      },
    ],
  },
];

export default () => {
  const [panel, setPanel] = useState<'dev' | 'admin'>('dev');
  const [options, setOptions] = useState<Option[]>();

  useEffect(() => {}, []);

  return (
    <MainBlock>
      <header>
        <Row id="title-row">
          <Col span={16}>
            <BarChartOutlined />
            Uncloudy Grapher
          </Col>
          <Col className="panel-col" span={8}>
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
          <Col span={16}>
            <Cascader
              style={{
                width: '100%',
              }}
              defaultValue={['seoulb01']}
              options={adminOptions}
              onChange={() => {}}
            />
          </Col>
          <Col span={8}>
            <DatePicker.RangePicker showTime />
          </Col>
          <Col span={8}></Col>
          <Col span={8}>Good</Col>
        </Row>
      </header>
      {/* <ContributeGraph id="sample1" data={rawData} /> */}
      {/* <UncloudyGraph id="sample2" data={rawData} /> */}
    </MainBlock>
  );
};
