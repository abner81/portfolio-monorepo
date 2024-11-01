import { User } from './user';

describe('User Entity', () => {
  const props = {
    email: 'johndoe@gmail.com',
    password: 'mypassword',
    name: 'john doe',
  };
  it('should create User with success', () => {
    const user = User.create(props);

    expect(user.export()).toEqual({
      ...props,
      name: 'John Doe',
      id: user.id.value,
      createdAt: user.createdAt.value,
      accessToken: null,
    });
  });

  it('should hide password', () => {
    const user = User.create(props);
    user.hidePassword();

    expect(user.password).toBeNull();
  });
});
