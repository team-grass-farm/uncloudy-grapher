import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResourceEditor } from '~components';
import { report } from '~utils/logger';

import { MainBlock } from './styles';
import { Props } from './types';

export default ({ id, data }: Props) => {
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    report.debug('DetailedGraph', {
      msg: `updated detailed graph ${data?.id}`,
    });
    setHidden(!!!data);
  }, [data]);

  return (
    <MainBlock hidden={hidden}>
      <Row>
        <Col span={16}>
          <h2>파드 상세 정보</h2>
        </Col>
        <Col span={8} className="close-col">
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setHidden(true)}
          />
        </Col>
      </Row>
      <ResourceEditor id={'d-' + data?.id} detailedData={data} />
    </MainBlock>
  );
};
