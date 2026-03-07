export class ActivityId {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error('ActivityId cannot be empty');
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }
}
