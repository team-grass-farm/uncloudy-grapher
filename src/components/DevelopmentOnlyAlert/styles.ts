import styled from 'styled-components';

export const MainBlock = styled.div`
  .ant-alert-message {
    max-height: 3rem;
    overflow-y: hidden;
  }

  @media (max-width: 600px) {
    .ant-alert-message,
    .ant-alert-description {
      display: none;
    }
  }
`;
