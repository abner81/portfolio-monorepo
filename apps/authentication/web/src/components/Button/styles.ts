import styled, { css } from 'styled-components';

export const Button = styled.button`
  ${({ theme }) => css`
    background-color: ${theme.colors.green};
    color: ${theme.colors.white};
    padding: 1.3rem 3rem;
    font-size: 1.7rem;
    font-weight: ${theme.font.bold};
    transition: all 0.3s ease-in-out;
    border-radius: 4.5rem;
    outline: none;
    border: none;
    cursor: pointer;

    margin-top: 2rem;

    img {
      width: "10px",
      height: "10px",
    }
  `}
`;
