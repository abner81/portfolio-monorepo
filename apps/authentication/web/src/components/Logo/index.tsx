import * as S from './styles';
import { useRouter } from 'next/router';

export function Logo() {
  const route = useRouter();
  return (
    <S.Text onClick={() => route.push('/login')}>
      Authenti<strong>Fy.</strong>
    </S.Text>
  );
}

export default Logo;
