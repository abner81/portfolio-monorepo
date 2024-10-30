import { ValueObject } from './value-object';

describe('Value Object', () => {
  it('should return true if equals objects to compare ', () => {
    class SUT extends NumberInteger {}

    const sut = new SUT({ value: 2 });
    const equalToSut = new SUT({ value: 2 });
    const different = new SUT({ value: 3 });

    expect(sut.equals(equalToSut)).toBeTruthy();
    expect(sut.equals(sut)).toBeTruthy();
    expect(sut.equals(different)).toBeFalsy();
  });

  type NumberIntegerProps = { value: number };
  class NumberInteger extends ValueObject<NumberIntegerProps> {
    protected parse(props: { value: number }): NumberIntegerProps {
      return { value: props.value.valueOf() };
    }

    export(): Required<NumberIntegerProps> {
      return { value: this.state.value.valueOf() };
    }
  }
});
