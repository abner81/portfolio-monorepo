export class SleepDataNotFoundException extends Error {
  override readonly name = 'SleepDataNotFoundException';

  constructor(message = 'Sleep data not found') {
    super(message);
  }
}
