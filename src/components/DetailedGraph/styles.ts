import styled from 'styled-components';

export const MainBlock = styled.article`
  /* position: relative; */
  min-width: 15rem;
  width: calc(34% + 1px);
  min-height: 17rem;
  max-width: 30rem;
  padding: 1rem;
  margin: -17rem 0 0.5rem 66% !important;
  background: rgba(250, 250, 250, 0.5);
  backdrop-filter: blur(15px);
  border: 1px solid #ddd;
  box-shadow: -13px 0px 12px -10px rgba(200, 200, 200, 0.5);
  overflow-wrap: break-word;
  overflow-y: auto;
  transition: opacity 0.5s;

  h2 {
    margin: 0.5rem 0;
  }

  .close-col {
    text-align: right;
  }

  &[hidden] {
    display: block !important;
    opacity: 0;
    pointer-events: none;
  }
`;
