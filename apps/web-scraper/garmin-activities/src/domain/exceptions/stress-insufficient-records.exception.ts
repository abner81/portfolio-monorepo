export class StressInsufficientRecordsException extends Error {
  override readonly name = 'StressInsufficientRecordsException';

  constructor(message = 'Insufficient stress records found') {
    super(message);
  }
}
