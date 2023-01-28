import { Pod } from 'kubernetes-models/v1';
import React, { useEffect, useState } from 'react';
import { report } from '~utils/logger';

import { MainBlock } from './styles';

import type { Props } from './types';

export default <T extends Resource.Pod | Resource.Node>({
  id,
  metric,
  data,
  ...otherProps
}: Props<T>) => {
  const [pod, setPod] = useState<Pod | null>(null);

  useEffect(() => {
    if (!!data) {
      // const pod = new Pod(data);
      // pod.validate();
      setPod(pod);
    }
  }, []);

  useEffect(() => {
    report.log('ResourceEditor', { msg: 'podData', data });
  }, [data]);

  return (
    <MainBlock {...otherProps}>
      {!!id && <h2>{data?.kind + data?.metadata}</h2>}
      {!!pod && (
        <>
          <h3>{pod.apiVersion}</h3>
          <li>{pod.spec?.dnsPolicy}</li>
        </>
      )}
    </MainBlock>
  );
};
