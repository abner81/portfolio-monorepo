export type KeyValue<V extends string> = {
  [key in V]: key;
};
