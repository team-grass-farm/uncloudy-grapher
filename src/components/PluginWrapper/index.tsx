import React from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ ...otherProps }: Props) => {
  return (
    <MainBlock>
      <h2>Hello</h2>
    </MainBlock>
  );
};
