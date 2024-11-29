import styled, { css } from 'styled-components';

export const Text = styled.p`
  ${({ theme }) => css`
    font-size: 5rem;
    font-weight: 700;
    cursor: pointer;
    strong {
      color: ${theme.colors.green};
    }
  `}
`;
