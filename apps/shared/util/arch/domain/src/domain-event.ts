export abstract class DomainEvent<TPayload> {
  private readonly _payload: TPayload;

  get payload() {
    return this._payload;
  }

  constructor(payload: TPayload) {
    this._payload = payload;
  }
}
