import { Alert, Button, Col, Row, Space, Switch } from 'antd';
import React from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({
  id,
  showGrids,
  showPoints,
  onChangeShowGrids,
  onChangeShowPoints,
  ...otherProps
}: Props) => {
  return (
    <MainBlock id={id} {...otherProps}>
      <Alert
        type="warning"
        message="디버깅을 위한 옵션"
        description="이 옵션들은 배포 시 보이지 않습니다."
        closable={true}
        // showIcon
        // closeIcon={
        //   <div>
        //     <Button
        //       type="ghost"
        //       style={{ marginTop: '0.55rem', marginLeft: '2rem' }}
        //     >
        //       닫기
        //     </Button>
        //   </div>
        // }
        action={
          <Space direction="vertical">
            <Row gutter={[10, 10]} style={{ textAlign: 'right' }}>
              <Col span={12}>
                <label htmlFor="s1">격자 보기 </label>
                <Switch
                  id="s1"
                  size="small"
                  checked={showGrids}
                  onChange={onChangeShowGrids}
                />
              </Col>
              <Col span={12}>
                <label htmlFor="s2">좌표 보기 </label>
                <Switch
                  id="s2"
                  size="small"
                  checked={showPoints}
                  onChange={onChangeShowPoints}
                />
              </Col>
            </Row>
          </Space>
        }
      />
    </MainBlock>
  );
};
