import {
  AnchorHTMLAttributes,
  createRef,
  InputHTMLAttributes,
  useRef,
} from 'react';
import * as S from './styles';

type InputTypes =
  | InputHTMLAttributes<HTMLInputElement>
  | AnchorHTMLAttributes<HTMLInputElement>;

export type Props = {
  icon?: JSX.Element;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name: string;
  required?: boolean;
  id: string;
  pattern?: string;
  error?: string;
} & Omit<InputTypes, 'onChange' | 'onMouseLeave'>;

export function TextField({
  icon,
  value,
  onChange,
  pattern,
  name,
  required,
  id,
  error,
  ...props
}: Props) {
  const ref = useRef<HTMLInputElement>();

  return (
    <>
      <S.Wrapper
        hasIcon={!!icon}
        id={(props.placeholder + onChange).toString()}
      >
        {!!icon && icon}
        <S.Input
          id={id}
          name={name}
          ref={ref}
          pattern={pattern}
          required={required}
          {...props}
          onChange={(e) => !!onChange && onChange(e.target.value)}
          // onMouseLeave={() => onMouseLeave(ref.current.value)}
        />
      </S.Wrapper>

      {!!error && <S.Error>{error}</S.Error>}
    </>
  );
}

export default TextField;
