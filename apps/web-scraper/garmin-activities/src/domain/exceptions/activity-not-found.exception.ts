export class ActivityNotFoundException extends Error {
  override readonly name = 'ActivityNotFoundException';

  constructor(message = 'Activity not found') {
    super(message);
  }
}
