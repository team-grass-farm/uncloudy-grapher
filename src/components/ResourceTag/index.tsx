import React from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, kind, wide, children, ...otherProps }: Props) => {
  return (
    <MainBlock className={(wide ? 'wide ' : '') + kind.toLowerCase()}>
      {children}
    </MainBlock>
  );
};
