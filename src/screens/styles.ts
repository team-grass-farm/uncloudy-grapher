import styled from 'styled-components';
import { MAX_WIDTH } from '~constants';

export const MainBlock = styled.div`
  padding: 2em 0;
  max-width: ${MAX_WIDTH}px;
  margin: auto;

  #title-row {
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    svg {
      margin-right: 0.5em;
    }
    .panel-col {
      text-align: right;
    }
  }

  #option-row {
    padding: 0.5rem 1rem;
  }

  #sample1 {
    height: 20em;
    overflow: hidden;
  }
`;
