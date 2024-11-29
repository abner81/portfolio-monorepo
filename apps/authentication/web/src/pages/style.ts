import _link from 'next/link';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #ffffff;
`;

export const Form = styled.form`
  flex-direction: column;
  flex: 1;
  display: flex;
  align-items: start;
  justify-content: center;
  width: 95%;
`;

export const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  padding: 7% 3%;
  flex-direction: column;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  width: 100%;
`;

export const Link = styled(_link)`
  ${({ theme }) => css`
    color: ${theme.colors.gray};
    transition: all 0.3s ease-in-out;

    &:hover {
      color: ${theme.colors.darkGray};
    }
  `}
`;
