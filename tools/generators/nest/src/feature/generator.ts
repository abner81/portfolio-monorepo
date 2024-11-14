import { generateFiles, names, Tree } from '@nx/devkit';
import { CreateNestFeatureGeneratorSchema } from './schema';
import {
  appendContent,
  convertToCamelCase,
  removePrefixTo,
} from '@monorepo/helpers';
import * as path from 'path';

class FeatureGenerator {
  public tree: Tree;
  public params: CreateNestFeatureGeneratorSchema;

  constructor(tree: Tree, params: CreateNestFeatureGeneratorSchema) {
    this.tree = tree;
    this.params = params;
  }

  private get projectPath() {
    return names(this.params.project).fileName;
  }
  private get projactName() {
    return this.projectPath.split('/')[0];
  }
  private get context() {
    return names(this.params.context).fileName;
  }
  private get targetName() {
    return names(this.params.name);
  }
  private get folder() {
    const _rawFolder =
      this.params?.folder ?? removePrefixTo(this.targetName.fileName);
    return names(_rawFolder).fileName;
  }
  private get controllersPath() {
    return `apps/${this.projectPath}/src/${this.context}/controllers`;
  }
  private get targetPath() {
    return `${this.controllersPath}/${this.folder}/${this.targetName.fileName}`;
  }

  private makeGenerateFile(fileType: string) {
    return generateFiles(
      this.tree,
      path.join(__dirname, 'files', fileType),
      this.targetPath,
      {
        folder: this.folder,
        context: this.context,
        template: '',
        project: this.projactName,
        httpMethod: this.params.httpMethod,
        repositoryName: this.params.repositoryName,
        name: this.targetName.fileName,
        convertToCamelCase,
        convertToUpperCase: (name: string) => name.toUpperCase(),
      }
    );
  }

  private mergeControllersIndex() {
    appendContent(
      this.tree,
      `${this.controllersPath}/index.ts`,
      `export * from "./${this.folder}"`
    );
  }

  private mergeTargetFolderIndex() {
    const folderIndexPath = `${this.controllersPath}/${this.folder}`;
    appendContent(
      this.tree,
      `${folderIndexPath}/index.ts`,
      `export * from "./${this.targetName.fileName}/${this.targetName.fileName}.controller"`
    );
  }

  private generateController() {
    this.makeGenerateFile('controller');
    this.mergeControllersIndex();
    this.mergeTargetFolderIndex();
  }

  private generateService() {
    this.makeGenerateFile('service');
  }

  private generateRepository() {
    this.makeGenerateFile('repository');
  }

  static execute(tree: Tree, params: CreateNestFeatureGeneratorSchema) {
    const instance = new FeatureGenerator(tree, params);
    instance.generateController();
    // instance.generateService();
  }
}

export const createNestFeatureGenerator = (
  tree: Tree,
  params: CreateNestFeatureGeneratorSchema
) => FeatureGenerator.execute(tree, params);

export default createNestFeatureGenerator;
