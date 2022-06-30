import styled from 'styled-components';

export const MainBlock = styled.div`
  width: 100%;
  min-height: 16rem;
  border: 1px solid #ddd;
  transition: background-color 0.5s;

  &:hover {
    background-color: #f8f8f8;
  }

  & > canvas {
    display: block;
    width: 100%;
    height: 16rem;
    margin-bottom: -16rem;
  }

  aside {
    width: 100%;
    margin-top: 12.75rem;
    background-color: rgba(240, 240, 240, 0.3);
    padding: 0.5rem;
    backdrop-filter: blur(0.5);
  }
`;
