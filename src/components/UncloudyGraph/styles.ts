import styled from 'styled-components';

export const MainBlock = styled.div`
  width: 100%;
  min-height: 16rem;
  border: 1px solid #ddd;
  margin: 0.5rem 0;
  transition: background-color 0.5s;

  &:hover {
    background-color: #f8f8f8;
  }

  & > section {
    width: 100%;
    height: 16rem;
    overflow: hidden;
    margin-bottom: -16rem;

    canvas {
      display: block;
      margin-top: -16rem;
      margin-bottom: -32rem;
      width: 200%;
      height: 32rem;

      /* TODO Split canvas size into these: */
      /* &#groups2,
      &#groups1,
      &#blocks {
        margin-top: -32rem;
        margin-bottom: -16rem;
        width: 200%;
        height: 200%;
      }

      &#base,
      &#grid,
      &#points,
      &#event {
        margin-bottom: -16rem;
        width: 100%;
        height: 100%;
      } */
    }
  }

  #tooltip-pos {
    position: absolute;
    background: #dd5555;
    color: white;
    font-size: 0.8rem;
    height: 1.5rem;
    white-space: nowrap;
    padding: 0.35rem;
  }

  aside {
    width: 100%;
    margin-top: 12.75rem;
    background-color: rgba(240, 240, 240, 0.3);
    padding: 0.5rem;
    backdrop-filter: blur(0.5);
  }
`;

export const ExtrudedBlock = styled.article`
  /* position: relative; */
  width: calc(34% + 1px);
  min-height: 17rem;
  max-width: 30rem;
  padding: 1rem;
  margin: -17rem 0 0.5rem 66% !important;
  background: rgba(250, 250, 250, 0.5);
  backdrop-filter: blur(15px);
  border: 1px solid #ddd;
  box-shadow: -13px 0px 12px -10px rgba(200, 200, 200, 0.5);
  overflow-wrap: normal;
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
