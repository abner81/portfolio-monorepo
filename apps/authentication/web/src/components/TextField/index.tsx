import { AnchorHTMLAttributes, InputHTMLAttributes } from 'react';
import * as S from './styles';

type InputTypes =
  | InputHTMLAttributes<HTMLInputElement>
  | AnchorHTMLAttributes<HTMLInputElement>;

export type Props = {
  icon?: JSX.Element;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
} & Omit<InputTypes, 'onChange'>;

export function TextField({ icon, value, onChange, error, ...props }: Props) {
  return (
    <>
      <S.Wrapper hasIcon={!!icon} id={props.placeholder + onChange}>
        {!!icon && icon}
        <S.Input
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </S.Wrapper>

      {!!error && <S.Error>{error}</S.Error>}
    </>
  );
}

export default TextField;
