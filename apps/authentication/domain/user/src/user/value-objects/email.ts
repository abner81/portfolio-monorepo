import { ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type EmailProps = { email: string };

export class Email extends ValueObject<EmailProps, string> {
  get value(): string {
    return this.state;
  }

  protected parse(props: EmailProps): string {
    const { email } = props;

    Guards.againstNullOrUndefined(email, 'email');
    Guards.againstInvalidEmail(email, 'email');

    return email.toLowerCase();
  }

  export(): Required<EmailProps> {
    return { email: this.state };
  }
}
