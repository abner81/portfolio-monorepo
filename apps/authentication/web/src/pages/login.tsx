import { ChangeEvent, FormEvent, SetStateAction, useState } from 'react';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import { Email, Password } from 'authentication/domain/user';

export default function Login() {
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const email = new Email({ email: emailValue });
      console.log(email);
    } catch (error) {
      setEmailError((error as Error)?.message);
    }

    // try {
    //   const password = new Password({ password: passwordValue });
    // } catch (error) {
    //   setPasswordError((error as Error)?.message);
    // }

    return;
  };

  return (
    <form
      style={{ width: '200px', marginLeft: '10px' }}
      onSubmit={handleSubmit}
    >
      <TextField
        id="email"
        placeholder="Email"
        value={emailValue}
        onChange={(value: string) => setEmailValue(value)}
        type="email"
        icon={<IoMailOutline />}
        aria-autocomplete="none"
        error={emailError}
      />

      <TextField
        id="password"
        placeholder="Senha"
        type="password"
        value={passwordValue}
        onChange={(value: string) => setPasswordValue(value)}
        icon={<IoLockClosedOutline />}
        aria-autocomplete="none"
        error={passwordError}
      />

      <Button type="submit">Log in</Button>
    </form>
  );
}
