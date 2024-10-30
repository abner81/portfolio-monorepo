import { DomainObject } from './domain-object';
import { DomainException } from './domain.exception';

describe('DomainObject', () => {
  const makeSUTNumber = (props: NumberProps): NumberValueObject => {
    class SUT extends NumberValueObject {}
    return new SUT(props);
  };

  it('should export to correct values', () => {
    const props = { value: 3 };
    const exported = makeSUTNumber(props).export();

    expect(exported).not.toBe(props);
    expect(exported).toStrictEqual(props);
  });

  it('should toString() with correct values', () => {
    const pNumber = makeSUTNumber({ value: 4 });
    const pString = new StringValueObject({ value: 'My String' });
    const pBoolean = new BooleanValueObject({ value: true });
    const pNull = new NullValueObject({ value: null });
    const pUndefined = new UndefinedValueObject({ value: undefined });

    const sNumber = String(pNumber);
    const sString = String(pString);
    const sBoolean = String(pBoolean);
    const sNull = String(pNull);
    const SUndefined = String(pUndefined);

    expect(sNumber).toBe('4');
    expect(sString).toBe('My String');
    expect(sBoolean).toBe('true');
    expect(sNull).toBe('null');
    expect(SUndefined).toBe('undefined');
  });

  it('should call parseAndStore() and parse() on instance Class', () => {
    const parseAndStoreSpy = jest.spyOn(
      NumberValueObject.prototype as any,
      'parseAndStore'
    );
    const parseSpy = jest.spyOn(NumberValueObject.prototype as any, 'parse');
    const props = { value: 3 };
    makeSUTNumber(props);

    expect(parseAndStoreSpy).toHaveBeenCalledWith(props);
    expect(parseSpy).toHaveBeenCalledWith(props);
  });

  it('should transform toJSON() with equal values an export()', () => {
    const props = { value: 3 };
    const sut = makeSUTNumber(props);
    const exported = sut.export();
    const toJSON = JSON.parse(JSON.stringify(sut));

    expect(toJSON).toStrictEqual(exported);
  });

  it('should throw error if not receive object in params', () => {
    const act = () => makeSUTNumber('not object' as unknown as NumberProps);
    expect(act).toThrow(DomainException);
  });

  it('should throw error if parse() isnt success', () => {
    const errorMessage = 'My Error Message';
    class SUT extends NumberValueObject {
      override parse(props: NumberProps): number {
        throw new DomainException(errorMessage);
      }
    }

    const sut = () => new SUT({ value: 3 });
    expect(sut).toThrow(DomainException);
    expect(sut).toThrow(errorMessage);
  });

  // ---------------------------------------------------

  type NumberProps = { value: number };
  class NumberValueObject extends DomainObject<NumberProps, number> {
    get value() {
      return this.state;
    }

    protected parse(props: NumberProps): number {
      const { value } = props;
      if (value == null) throw new RequiredError();
      if (typeof value != 'number') throw new TypeofError();
      return value;
    }

    export(): Required<NumberProps> {
      return { value: this.state };
    }
  }

  type StringProps = { value: string };
  class StringValueObject extends DomainObject<StringProps, string> {
    get value() {
      return this.state;
    }

    protected parse(props: StringProps): string {
      const { value } = props;
      return value;
    }

    export(): Required<StringProps> {
      return { value: this.state };
    }
  }

  type BooleanProps = { value: boolean };
  class BooleanValueObject extends DomainObject<BooleanProps, boolean> {
    get value() {
      return this.state;
    }

    protected parse(props: BooleanProps): boolean {
      const { value } = props;
      return value;
    }

    export(): Required<BooleanProps> {
      return { value: this.state };
    }
  }

  type NullProps = { value: null };
  class NullValueObject extends DomainObject<NullProps, null> {
    get value() {
      return this.state;
    }

    protected parse(props: NullProps): null {
      const { value } = props;
      return value;
    }

    export(): Required<NullProps> {
      return { value: this.state };
    }
  }

  type UndefinedProps = { value: undefined };
  class UndefinedValueObject extends DomainObject<UndefinedProps, undefined> {
    get value() {
      return this.state;
    }

    protected parse(props: UndefinedProps): undefined {
      const { value } = props;
      return value;
    }

    export(): Required<UndefinedProps> {
      return { value: this.state };
    }
  }

  class TypeofError extends DomainException {
    constructor() {
      super('Error in the type.');
    }
  }
  class RequiredError extends DomainException {
    constructor() {
      super('This is required.');
    }
  }
});
