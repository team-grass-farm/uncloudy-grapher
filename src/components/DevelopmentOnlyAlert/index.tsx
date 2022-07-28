import { Alert, Button, Col, Row, Slider, Space, Switch } from 'antd';
import React from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, data, onChangeData, ...otherProps }: Props) => {
  return (
    <MainBlock id={id} {...otherProps}>
      <Alert
        type="warning"
        message="디버깅을 위한 옵션"
        description="이 옵션들은 배포 시 보이지 않습니다."
        closable={true}
        action={
          <Space direction="vertical">
            <Row gutter={[10, 10]} style={{ textAlign: 'right' }}>
              {data.showGrids !== undefined && (
                <Col span={8}>
                  <label htmlFor="s1">격자 보기 </label>
                  <Switch
                    id="s1"
                    size="small"
                    checked={data.showGrids}
                    onChange={(showGrids) =>
                      onChangeData({ ...data, showGrids })
                    }
                  />
                </Col>
              )}
              {data.showPoints !== undefined && (
                <Col span={8}>
                  <label htmlFor="s2">좌표 보기 </label>
                  <Switch
                    id="s2"
                    size="small"
                    checked={data.showPoints}
                    onChange={(showPoints) =>
                      onChangeData({ ...data, showPoints })
                    }
                  />
                </Col>
              )}
              {data.showBlocks !== undefined && (
                <Col span={8}>
                  <label htmlFor="s3">샘플 블럭 보기 </label>
                  <Switch
                    id="s3"
                    size="small"
                    checked={data.showBlocks}
                    onChange={(showBlocks) =>
                      onChangeData({ ...data, showBlocks })
                    }
                  />
                </Col>
              )}
              {data.level !== undefined && (
                <>
                  <Col span={9}>
                    <label htmlFor="s3">보기 레벨</label>
                  </Col>
                  <Col span={15}>
                    <Slider
                      id="s3"
                      value={data.level}
                      min={1}
                      max={3}
                      onChange={(level) => onChangeData({ ...data, level })}
                    />
                  </Col>
                </>
              )}
            </Row>
          </Space>
        }
      />
    </MainBlock>
  );
};
