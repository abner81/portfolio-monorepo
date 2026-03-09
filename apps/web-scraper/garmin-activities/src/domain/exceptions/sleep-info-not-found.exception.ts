export class SleepInfoNotFoundException extends Error {
  override readonly name = 'SleepInfoNotFoundException';

  constructor(message = 'Sleep info not found') {
    super(message);
  }
}
