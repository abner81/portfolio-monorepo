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

type IValueObjects = {
  email?: Email;
  password?: Password;
  name?: Name;
};

export default function Login() {
  const [nameValue, setNameValue] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();

  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const [passwordValue, setPasswordValue] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const event = e as any;
    const data = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log(data);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch('http://localhost:3007/login', options);
    console.log(response);
  };

  return (
    <form
      style={{ width: '200px', marginLeft: '10px' }}
      onSubmit={handleSubmit}
    >
      <TextField
        id="name"
        name="name"
        placeholder="Nome Completo"
        type="text"
        // value={nameValue}
        // onChange={(value: string) => setNameValue(value)}
        icon={<IoPersonOutline />}
        aria-autocomplete="none"
        aria-required
        pattern="^\s*\S+(\s+\S+)+\s*$"
        title="Digite o seu nome completo."
      />

      <TextField
        id="email"
        name="email"
        placeholder="Email"
        value={emailValue}
        onChange={(value: string) => setEmailValue(value)}
        type="email"
        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        icon={<IoMailOutline />}
        aria-autocomplete="none"
        aria-required
        title="Digite o seu email."
      />

      <TextField
        id="password"
        name="password"
        placeholder="Senha"
        type="password"
        value={passwordValue}
        pattern="^(?:\D*\d){8}.*$"
        onChange={(value: string) => setPasswordValue(value)}
        icon={<IoLockClosedOutline />}
        aria-autocomplete="none"
        aria-required
        title="Digite uma senha com no mínimo 8 dígitos."
      />

      <Button
        id="button"
        type="submit"
        // aria-readonly={
        //   !isValid.current.email ||
        //   !isValid.current.name ||
        //   !isValid.current.password
        // }
      >
        Log in
      </Button>
    </form>
  );
}
