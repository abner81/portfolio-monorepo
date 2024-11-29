import { FormEvent, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { Email, Password } from 'authentication/domain/user';
import { Name } from '@monorepo/value-objects';
import * as S from '../components/styles';
import Logo from '../components/Logo';
import InfoPanel from '../components/InfoPanel';
import toast, { Toaster } from 'react-hot-toast';

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
      const raw = await fetch(process.env['API_URL'] + '/users', options);
      setIsLoading(false);
      if (raw.status >= 400) {
        const response = await raw.json();
        toast.error(response.error);
      } else toast.success('Usuário registrado com sucesso!');
    } catch (error) {
      setIsLoading(false);
      toast.error((error as any).message);
    }
  };

  return (
    <S.Container>
      <Toaster />
      <InfoPanel />
      <S.FormWrapper>
        <Logo />
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

          <S.Actions>
            <Button id="button" type="submit">
              {isLoading ? 'Carregando...' : 'Registrar'}
            </Button>
          </S.Actions>
        </S.Form>
      </S.FormWrapper>
    </S.Container>
  );
}
