type Event<E extends object = object> = E;

export interface EventHandler<E extends Event> {
  handle(event: E): Promise<void>;
}
