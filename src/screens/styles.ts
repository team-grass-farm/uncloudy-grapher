import styled from 'styled-components';
import { MAX_WIDTH } from '~constants';

export const MainBlock = styled.div`
  padding: 1rem 0;
  max-width: ${MAX_WIDTH}px;
  margin: auto;

  header,
  main {
    padding: 0.5rem 1rem;
  }

  main > * + * {
    margin-top: 0.5rem;
  }

  #title-row {
    font-size: 1.5rem;
    svg {
      margin-right: 0.5em;
    }
    .panel-col {
      text-align: right;
    }
  }

  .ant-row + .ant-row {
    margin-top: 0.5rem;
  }

  #sample1 {
    height: 20em;
    overflow: hidden;
  }
`;
