export interface IEquals {
  equals(other: unknown): other is this;
}
