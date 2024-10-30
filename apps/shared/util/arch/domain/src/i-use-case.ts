export interface IUseCase<IRequest, IResponse> {
  execute(params: IRequest): Promise<IResponse>;
}
