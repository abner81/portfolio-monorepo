import { DomainEvent } from './domain-event';
import { Entity } from './entity';

describe('Entity', () => {
  it('should can be mutable', () => {
    const sut = new SUTEntity({ email: 'email@gmail.com' });
    sut.email = 'new_email@gmail.com';

    expect(sut.email).toBe('new_email@gmail.com');
  });

  it('should be return clone on call Clone()', () => {
    const sut = new SUTEntity({ email: 'email@gmail.com' });
    const sutClone = sut.clone();

    expect(sutClone).toBeInstanceOf(SUTEntity);
    expect(sutClone).not.toBe(sut);

    sut.email = 'new_email@gmail.com';
    expect(sutClone.email).toBe('email@gmail.com');
  });

  type SUTEntityProps = { email: string };
  class SUTEntity extends Entity<SUTEntityProps, SUTEntityProps> {
    protected parse(props: SUTEntityProps): SUTEntityProps {
      return { email: props.email };
    }

    export(): Required<SUTEntityProps> {
      return { email: this.state.email };
    }

    get email() {
      return this.state.email;
    }

    set email(value: string) {
      this.state.email = value;
    }
  }
});
