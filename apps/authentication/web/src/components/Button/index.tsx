import { ButtonHTMLAttributes } from 'react';
import * as S from './styles';

type InputTypes = ButtonHTMLAttributes<HTMLButtonElement>;

export type Props = {} & InputTypes;

export function Button({ children, ...props }: Props) {
  return <S.Button {...props}>{children}</S.Button>;
}

export default Button;
