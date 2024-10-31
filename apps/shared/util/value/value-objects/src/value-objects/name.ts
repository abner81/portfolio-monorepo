import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { capitalize } from '@monorepo/helpers';

export class InvalidNameException extends DomainException {
  constructor() {
    super(`Invalid name. Enter your first and last name.`);
  }
}

export type NameProps = {
  name: string;
};

export class Name extends ValueObject<NameProps, string> {
  public static minWords = 2;
  get value(): string {
    return this.state;
  }

  get firstName() {
    return this.value.split(' ')[0];
  }

  get lastName() {
    return this.value.split(' ')[1];
  }

  private capitalizeName(name: string) {
    const remainLowercase = ['de', 'da', 'do', 'dos', 'das'];
    return name
      .trim()
      .split(/\s+/)
      .map((word, index) => {
        const notApplyInWord =
          remainLowercase.includes(word.toLowerCase()) && index > 0;
        if (notApplyInWord) return word.toLowerCase();

        return capitalize(word);
      })
      .join(' ');
  }

  protected parse(props: NameProps): string {
    const { name } = props;

    Guards.againstNullOrUndefined(name, 'Name');
    try {
      Guards.ensureMinWords(Name.minWords, name, 'Name');
    } catch (error) {
      throw new InvalidNameException();
    }

    return this.capitalizeName(name.trim());
  }

  export(): Required<NameProps> {
    return { name: this.state };
  }
}
