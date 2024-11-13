export interface IApplicationService<Input = unknown, Output = void> {
  execute(params: Input): Promise<Output>;
}
