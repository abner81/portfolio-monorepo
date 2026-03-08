export class LoginFailedException extends Error {
  override readonly name = 'LoginFailedException';

  constructor(message = 'Login failed') {
    super(message);
  }
}
