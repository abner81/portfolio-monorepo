import styled, { css, DefaultTheme } from 'styled-components';

const wrapperModifiers = {
  withIcon: (theme: DefaultTheme) => css`
    svg {
      font-size: 1.9rem;
      color: ${theme.colors.gray};
    }
  `,
};

export const Wrapper = styled.div<{ hasIcon: boolean }>`
  ${({ theme, hasIcon }) => css`
    border-bottom: 1px solid ${theme.colors.lightGray};
    ${hasIcon && wrapperModifiers.withIcon(theme)};
    display: inline-flex;
    align-items: center;
    width: 100%;
    margin-bottom: 3rem;
  `}
`;

const inputModifiers = {
  fontSize: () => css`
    font-size: 1.5rem;
  `,
};

export const Input = styled.input`
  ${({ theme }) => css`
    background: none;
    border: none;
    min-height: 3rem;
    padding: 1rem 1rem 1rem 1.5rem;
    color: ${theme.colors.black};
    ${inputModifiers.fontSize()}
    width: 100%;
    &:focus-visible {
      outline: none;
    }

    &::placeholder {
      ${inputModifiers.fontSize()}
      color: ${theme.colors.gray};
    }
  `}
`;

export const Error = styled.input`
  ${({ theme }) => css`
    color: ${theme.colors.red};
  `}
`;
