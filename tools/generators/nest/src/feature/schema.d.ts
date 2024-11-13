export type IHttpMethod = 'Get' | 'Post' | 'Put' | 'Patch' | 'Delete';

export interface CreateNestFeatureGeneratorSchema {
  name: string;
  repositoryName: string;
  httpMethod: IHttpMethod;
  project: string;
}
