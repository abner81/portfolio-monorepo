import _link from 'next/link';
import styled, { css } from 'styled-components';

export const Background = styled.div`
  width: 70%;
  background-image: url('https://affixtheme.com/html/xmee/demo/img/figure/bg5-l.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  align-items: center;
  justify-content: center;
  display: flex;

  @media (max-width: 850px) {
    width: 50%;
    strong {
      word-wrap: break-word;
    }
  }

  @media (max-width: 615px) {
    display: none;
  }
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
      font-size: 85px;
      font-weight: 700;
      line-height: 1;
    }
  `}
`;
