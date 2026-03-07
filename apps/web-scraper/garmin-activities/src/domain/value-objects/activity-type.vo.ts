export class ActivityType {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error('ActivityType cannot be empty');
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }
}
