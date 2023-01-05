import { Pod } from 'kubernetes-models/v1';
import React, { useEffect, useState } from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, data, ...otherProps }: Props) => {
  const [pod, setPod] = useState<Pod | null>(null);

  useEffect(() => {
    const pod = new Pod(data);
    pod.validate();
    setPod(pod);
  }, []);

  return (
    <MainBlock>
      {!!pod && (
        <>
          <h3>{pod.apiVersion}</h3>
          <li>{pod.spec?.dnsPolicy}</li>
        </>
      )}
    </MainBlock>
  );
};
