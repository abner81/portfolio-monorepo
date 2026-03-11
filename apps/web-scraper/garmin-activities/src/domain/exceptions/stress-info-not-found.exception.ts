export class StressInfoNotFoundException extends Error {
  override readonly name = 'StressInfoNotFoundException';

  constructor(message = 'Stress info not found') {
    super(message);
  }
}
