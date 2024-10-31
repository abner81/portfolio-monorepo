import { DomainException } from '@monorepo/arch/domain';
import { AccessToken } from './access-token';

describe('Access Token V.O', () => {
  const props = {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvbiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  };

  it('should create AccessToken with success', () => {
    const sut = new AccessToken(props);

    expect(sut.value).toBe(props.accessToken);
    expect(sut.export()).toStrictEqual({ accessToken: props.accessToken });
  });

  it('should throw error if passed a invalid AccessToken', () => {
    const empty = () => new AccessToken({ accessToken: '' });
    const invalid = () => new AccessToken({ accessToken: 'any_token' });
    const isNull = () =>
      new AccessToken({ accessToken: null as unknown as string });
    const isUndefined = () =>
      new AccessToken({ accessToken: undefined as unknown as string });

    expect(empty).toThrow(DomainException);
    expect(invalid).toThrow(DomainException);
    expect(isNull).toThrow(DomainException);
    expect(isUndefined).toThrow(DomainException);
  });
});
