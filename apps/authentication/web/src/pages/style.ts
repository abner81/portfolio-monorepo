import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

export const Background = styled.div`
  width: 70%;
  background-image: url('https://affixtheme.com/html/xmee/demo/img/figure/bg5-l.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const Content = styled.div`
  ${({ theme }) => css`
    max-width: 500px;
    width: 100%;
    padding: 30px;
    color: ${theme.colors.white};

    h1 {
      font-weight: 300;
      font-size: 40px;
      color: #fff;
      line-height: 1.5;
    }

    p {
      margin-top: 25px;
      line-height: 1.5;
    }

    strong {
      font-size: 88px;
      font-weight: 700;
      line-height: 1;
    }
  `}
`;

export const Form = styled.form`
  flex-direction: column;
  flex: 1;
  display: flex;
  align-items: start;
  justify-content: center;
`;

export const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  padding: 0 3%;
`;
