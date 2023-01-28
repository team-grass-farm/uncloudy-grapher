import styled from 'styled-components';

export const MainBlock = styled.span`
  height: 100%;
  padding: 0.25rem 0;

  &:not(.wide) {
    padding: 0.25rem 0.5rem;
    border: 1px solid #999;
    border-radius: 1rem;
  }

  &.pod {
    &.wide:before {
      content: '';
      display: inline-block;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      margin-right: 0.75rem;
      background-color: #08a8a9;
    }
  }
`;
