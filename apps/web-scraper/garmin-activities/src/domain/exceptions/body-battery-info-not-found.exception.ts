export class BodyBatteryInfoNotFoundException extends Error {
  override readonly name = 'BodyBatteryInfoNotFoundException';

  constructor(message = 'Body battery info not found') {
    super(message);
  }
}
