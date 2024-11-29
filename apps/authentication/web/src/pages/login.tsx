import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { Email, Password } from 'authentication/domain/user';
import { Name } from '@monorepo/value-objects';
import * as S from './style';

type IValueObjects = {
  email?: Email;
  password?: Password;
  name?: Name;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const event = e as any;
    const data = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    try {
      const raw = await fetch('http://localhost:3007/login', options);
      const response = await raw.json();
      setIsLoading(false);
      if (!raw.ok) alert(response.error);
    } catch (error) {
      setIsLoading(false);
      alert((error as any).message);
    }
  };

  return (
    <S.Container>
      <S.Background>
        <S.Content>
          <h1>
            Welcome To <br /> <strong>Our xmee</strong>
          </h1>
          <p>
            Grursus mal suada faci lisis Lorem ipsum dolarorit ametion
            consectetur elit. Vesti ulum nec the dumm.
          </p>
        </S.Content>
      </S.Background>
      <S.FormWrapper>
        <S.Form onSubmit={handleSubmit}>
          <TextField
            id="name"
            name="name"
            placeholder="Nome Completo"
            type="text"
            icon={<IoPersonOutline />}
            aria-autocomplete="none"
            required
            pattern="^\s*\S+(\s+\S+)+\s*$"
            title="Digite o seu nome completo."
          />

          <TextField
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            icon={<IoMailOutline />}
            aria-autocomplete="none"
            required
            title="Digite o seu email."
          />

          <TextField
            id="password"
            name="password"
            placeholder="Senha"
            type="password"
            pattern="^.{8,}$"
            icon={<IoLockClosedOutline />}
            aria-autocomplete="none"
            required
            title="Digite uma senha com no mínimo 8 dígitos."
          />

          <Button id="button" type="submit">
            {isLoading ? 'Carregando...' : 'Entrar'}
          </Button>
        </S.Form>
      </S.FormWrapper>
    </S.Container>
  );
}
