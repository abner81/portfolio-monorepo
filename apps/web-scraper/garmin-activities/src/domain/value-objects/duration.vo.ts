export class Duration {
  private readonly seconds: number;

  constructor(seconds: number) {
    if (!Number.isFinite(seconds)) {
      throw new Error('Duration must be a finite number');
    }
    if (seconds <= 0) {
      throw new Error('Duration must be greater than zero');
    }
    if (!Number.isInteger(seconds)) {
      throw new Error('Duration must be an integer number of seconds');
    }

    this.seconds = seconds;
  }

  toSeconds(): number {
    return this.seconds;
  }
}
