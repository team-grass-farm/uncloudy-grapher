import { Cascader, Col, DatePicker, Row, Segmented } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { UncloudyGraph } from '~components';
import { SAMPLE_NODES, SAMPLE_PODS } from '~constants';

import { BarChartOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons';

import { MainBlock } from './styles';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export default () => {
  const [panel, setPanel] = useState<'dev' | 'admin'>('dev');
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (panel === 'admin') {
      const candidates: { [s in 'seoul' | 'busan']: Option } = {
        seoul: { value: 'seoul', label: '서울', children: [] },
        busan: { value: 'busan', label: '부산', children: [] },
      };
      SAMPLE_NODES.forEach((node) => {
        candidates[node.region].children!.push({
          value: node.id,
          label: node.id,
        });
      });
      setOptions([...Object.values(candidates)]);
      console.log('[Main] Set options to ', [...Object.values(candidates)]);
    } else {
      const candidates: { [s: string]: Option } = {};
      SAMPLE_PODS.forEach((pod) => {
        if (candidates[pod.deploymentId] === undefined) {
          candidates[pod.deploymentId] = {
            value: pod.deploymentId,
            label: pod.deploymentId,
            children: [
              {
                value: pod.id,
                label: pod.shortId,
              },
            ],
          };
        } else {
          candidates[pod.deploymentId].children!.push({
            value: pod.id,
            label: pod.shortId,
          });
        }
      });
      setOptions([...Object.values(candidates)]);
      console.log('[Main] Set options to ', [...Object.values(candidates)]);
    }
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
      {/* <ContributeGraph id="sample1" data={rawData} /> */}
      <main>
        <UncloudyGraph nodes={SAMPLE_NODES} pods={SAMPLE_PODS} />
      </main>
    </MainBlock>
  );
};
