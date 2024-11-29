import * as S from './styles';

export function InfoPanel() {
  return (
    <S.Background>
      <S.Content>
        <h1>
          Seja bem-vindo ao <br /> <strong>AuthentiFy</strong>
        </h1>
        <p>
          Gerencie autenticação e registro de usuários de forma simples, rápida
          e segura.
        </p>
      </S.Content>
    </S.Background>
  );
}

export default InfoPanel;
