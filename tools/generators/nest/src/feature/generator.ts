import { generateFiles, names, Tree } from '@nx/devkit';
import { CreateNestFeatureGeneratorSchema } from './schema';
import {
  appendContent,
  convertToCamelCase,
  convertToKebabCase,
  removePrefixTo,
} from '@monorepo/helpers';
import * as path from 'path';
import * as ts from 'typescript';
import {
  InsertChange,
  applyToUpdateRecorder,
} from '@schematics/angular/utility/change';

export type FileType = 'controller' | 'service' | 'repository';

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
  private get projectSrcPath() {
    return `apps/${this.projectPath}/src`;
  }
  private get controllersPath() {
    return `${this.projectSrcPath}/${this.context}/controllers`;
  }
  private get servicesPath() {
    return `${this.applicationContextPath}/services`;
  }
  private get controllerTargetPath() {
    return `${this.controllersPath}/${this.folder}/${this.targetName.fileName}`;
  }
  private get serviceTargetPath() {
    return `${this.servicesPath}/${this.folder}/${this.targetName.fileName}`;
  }
  private get applicationContextPath() {
    return `apps/${this.projactName}/application/src/${this.context}`;
  }

  private makeGenerateFile(fileType: string, _path: string) {
    return generateFiles(
      this.tree,
      path.join(__dirname, 'files', fileType),
      _path,
      {
        folder: this.folder,
        context: this.context,
        template: '',
        project: this.projactName,
        httpMethod: this.params.httpMethod,
        repositoryName: this.params.repositoryName,
        name: this.targetName.fileName,
        convertToCamelCase,
        convertToKebabCase,
        convertToConstant: (name: string) =>
          name.toUpperCase().replaceAll('-', '_'),
      }
    );
  }

  private mergeIndex(path: string) {
    appendContent(
      this.tree,
      `${path}/index.ts`,
      `export * from "./${this.folder}"`
    );
  }

  private mergeTargetFolderIndex(type: FileType, folderPath: string) {
    const folderIndexPath = `${this.controllersPath}/${this.folder}`;
    appendContent(
      this.tree,
      `${folderIndexPath}/index.ts`,
      `export * from "./${this.targetName.fileName}/${this.targetName.fileName}.${type}"`
    );
  }

  private addServiceInConstants() {
    const constantName = `${this.targetName.constantName}_SERVICE`;
    const interfaceName = `I${this.targetName.className}Service`;

    appendContent(
      this.tree,
      `${this.projectSrcPath}/config/constants.ts`,
      `export const ${constantName} = '${interfaceName}';`
    );
  }

  private addControllerToModule() {
    const modulePath = `${this.projectSrcPath}/${this.context}/${this.context}.module.ts`;
    const controllerClassName = `${this.targetName.className}Controller`;
    const controllerPath = `./controllers`;

    if (!this.tree.exists(modulePath)) {
      throw new Error(`Module file ${modulePath} not found`);
    }

    let moduleSource = this.tree.read(modulePath, 'utf-8')!;

    // Step 1: Add the import statement for the new controller if not present
    const controllerImportRegex = new RegExp(
      `import\\s*{([^}]*)}\\s*from\\s*'${controllerPath}';`
    );
    if (controllerImportRegex.test(moduleSource)) {
      moduleSource = moduleSource.replace(
        controllerImportRegex,
        (match, imports) => {
          const updatedImports = imports
            .split(',')
            .map((imp) => imp.trim())
            .filter((imp) => imp);
          if (!updatedImports.includes(controllerClassName)) {
            updatedImports.push(controllerClassName);
          }
          return `import { ${updatedImports.join(
            ', '
          )} } from '${controllerPath}';`;
        }
      );
    } else {
      // Add new import statement if it doesn't exist
      moduleSource =
        `import { ${controllerClassName} } from '${controllerPath}';\n` +
        moduleSource;
    }

    // Step 2: Add the controller to the @Module 'controllers' array
    if (moduleSource.includes('controllers: [')) {
      moduleSource = moduleSource.replace(
        /controllers: \[([^\]]*)\]/,
        (match, controllers) =>
          `controllers: [${controllers.trim()}, ${controllerClassName}]`
      );
    } else {
      moduleSource = moduleSource.replace(
        '@Module({',
        `@Module({\n  controllers: [${controllerClassName}],`
      );
    }

    // Write the updated module source back to the file
    this.tree.write(modulePath, moduleSource);
  }

  private generateController() {
    this.addServiceInConstants();
    this.makeGenerateFile('controller', this.controllerTargetPath);

    this.mergeIndex(this.controllersPath);
    this.mergeTargetFolderIndex(
      'controller',
      `${this.controllersPath}/${this.folder}`
    );

    this.addControllerToModule();
  }

  private generateService() {
    this.makeGenerateFile('service', this.serviceTargetPath);
    this.mergeIndex(this.servicesPath);
    this.mergeTargetFolderIndex(
      'service',
      `${this.servicesPath}/${this.folder}`
    );
  }

  private generateRepository() {
    this.makeGenerateFile('repository', '');
  }

  static execute(tree: Tree, params: CreateNestFeatureGeneratorSchema) {
    const instance = new FeatureGenerator(tree, params);
    // instance.generateController();
    instance.generateService();
  }
}

export const createNestFeatureGenerator = (
  tree: Tree,
  params: CreateNestFeatureGeneratorSchema
) => FeatureGenerator.execute(tree, params);

export default createNestFeatureGenerator;
