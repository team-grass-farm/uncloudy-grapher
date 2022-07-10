import React, { useEffect } from 'react';
import { useTheme } from 'styled-components';
import { usePainter } from '~hooks';

// import Grass from '../Grass';
import { MainBlock } from './styles';
import { Props } from './types';

export default ({ id, data, ...otherProps }: Props) => {
  const test = useTheme();
  const [legendRef, _b1, updateLegendPainter] = usePainter('legend');
  const [boxRef, _b2, updateBoxPainter] = usePainter('box');
  const [grassRef, _b3, updateGrassPainter] = usePainter('grass');

  useEffect(() => {
    console.log('test theme: ', test);
    const chunks: number[][] = [];
    for (let i = 0; i < data.length; i += 7) {
      chunks.push(data.slice(i, i + 7));
    }
    updateLegendPainter(chunks);
    updateBoxPainter(chunks);
    updateGrassPainter(chunks);
  }, []);

  return (
    <MainBlock id={id} {...otherProps}>
      <canvas
        id="legends"
        ref={legendRef}
        style={{
          marginBottom: legendRef.current ? -legendRef.current.clientHeight : 0,
        }}
      />
      <canvas
        id="boxes"
        ref={boxRef}
        style={{
          marginBottom: boxRef.current ? -boxRef.current.clientHeight : 0,
        }}
      />
      <canvas id="grasses" ref={grassRef} />
    </MainBlock>
  );
};
