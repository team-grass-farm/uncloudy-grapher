import React from 'react';

import { MainBlock } from './styles';

import type { Props } from './types';

export default ({ id, data, ...otherProps }: Props) => {
  return <MainBlock id={id} {...otherProps}></MainBlock>;
};
