import React from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({
  id,
  clusters,
  nodes,
  deployments,
  pods,
  ...otherProps
}: Props) => {
  return <MainBlock id={id} {...otherProps}></MainBlock>;
};
