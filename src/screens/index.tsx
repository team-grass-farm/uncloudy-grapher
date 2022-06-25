import React from 'react';
import { ContributeGraph } from '~components';

import { MainBlock } from './styles';

export default () => {
  const rawData = Array.from(Array(56).keys());

  return (
    <MainBlock>
      <ContributeGraph id="sample1" data={rawData} />
      {/* <UncloudyGraph id="sample2" data={rawData} /> */}
    </MainBlock>
  );
};
