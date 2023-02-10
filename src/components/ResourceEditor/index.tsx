import { Pod } from 'kubernetes-models/v1';
import React, { useEffect, useState } from 'react';
import { report } from '~utils/logger';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, detailedData, ...otherProps }: Props) => {
  const [pod, setPod] = useState<Pod | null>(null);

  useEffect(() => {
    // if (!!data) {
    //   const pod = new Pod(data);
    //   // pod.validate();
    //   setPod(pod);
    // }
  }, []);

  useEffect(() => {
    report.log('ResourceEditor', { msg: 'added detailed data', detailedData });
  }, [detailedData]);

  if (!!!detailedData) {
    return <MainBlock {...otherProps}>데이터가 없습니다.</MainBlock>;
  }

  return (
    <MainBlock {...otherProps}>
      <h2>{detailedData.id}</h2>
      <h2>{detailedData?.kind}</h2>
      {!!pod && (
        <>
          <h3>{pod.apiVersion}</h3>
          <li>{pod.spec?.dnsPolicy}</li>
        </>
      )}
    </MainBlock>
  );
};
