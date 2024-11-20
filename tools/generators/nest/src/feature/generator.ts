import { generateFiles, names, Tree } from '@nx/devkit';
import { CreateNestFeatureGeneratorSchema } from './schema';
import {
  appendContent,
  convertToCamelCase,
  convertToKebabCase,
  removePrefixTo,
} from '@monorepo/helpers';
import * as path from 'path';

export type FileType =
  | 'controller'
  | 'service'
  | 'repository'
  | 'i-repository'
  | 'interfaces'
  | 'repositories';

export type ToModuleOptions = {
  modulePath: string;
  provider: {
    token: string;
    className: string;
    importPath: string;
  };
};

class FeatureGenerator {
  public tree: Tree;
  public params: CreateNestFeatureGeneratorSchema;

  constructor(tree: Tree, params: CreateNestFeatureGeneratorSchema) {
    this.tree = tree;
    this.params = params;
  }

  private get projectName() {
    const projectPath = names(this.params.project).fileName;
    return projectPath.split('/')[0];
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

  private get appSrcPath() {
    return `apps/${this.projectName}/api/app/src`;
  }
  private get applicationSrcPath() {
    return `apps/${this.projectName}/api/application/src`;
  }
  private get controllersPath() {
    return `${this.appSrcPath}/${this.context}/controllers`;
  }
  private get servicesPath() {
    return `${this.applicationContextPath}/services`;
  }
  private get infraSrcPath() {
    return `apps/${this.projectName}/api/infra/src`;
  }
  private get serviceTargetPath() {
    return `${this.servicesPath}/${this.folder}/${this.targetName.fileName}`;
  }
  private get controllerTargetPath() {
    return `${this.controllersPath}/${this.folder}/${this.targetName.fileName}`;
  }
  private get applicationContextPath() {
    return `apps/${this.projectName}/api/application/src/${this.context}`;
  }

  private makeGenerateFile(fileType: FileType, targetPath: string) {
    return generateFiles(
      this.tree,
      path.join(__dirname, 'files', fileType),
      targetPath,
      {
        folder: this.folder,
        context: this.context,
        template: '',
        project: this.projectName,
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
    appendContent(
      this.tree,
      `${folderPath}/index.ts`,
      `export * from "./${this.targetName.fileName}/${this.targetName.fileName}.${type}"`
    );
  }

  private addInConstants(fileType: FileType) {
    const type = names(fileType);
    const constantName = `${this.targetName.constantName}_${type.constantName}`;
    const interfaceName = `I${this.targetName.className}${type.className}`;

    appendContent(
      this.tree,
      `${this.appSrcPath}/config/constants.ts`,
      `export const ${constantName} = '${interfaceName}';`
    );
  }

  private addControllerToModule() {
    const modulePath = `${this.appSrcPath}/${this.context}/${this.context}.module.ts`;
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

  private makeServiceToModuleOptions(): ToModuleOptions {
    const modulePath = `${this.applicationSrcPath}/application.module.ts`;
    const token = `${this.targetName.constantName}_SERVICE`;
    const className = `${this.targetName.className}Service`;
    const importPath = `./${this.context}/services`;

    return { modulePath, provider: { token, className, importPath } };
  }

  private makeRepositoryToModuleOptions(): ToModuleOptions {
    const modulePath = `${this.infraSrcPath}/infra.module.ts`;
    const token = `${this.targetName.constantName}_REPOSITORY`;
    const className = `${this.targetName.className}Repository`;
    const importPath = `./shared/repositories`;

    return { modulePath, provider: { token, className, importPath } };
  }

  private addProviderToModule(options: ToModuleOptions) {
    const modulePath = `${this.applicationSrcPath}/application.module.ts`;
    const providerToken = `${this.targetName.constantName}_SERVICE`;
    const providerClassName = `${this.targetName.className}Service`;
    const providerPath = `./${this.context}/services`;
    const tokenPath = `${this.projectName}/api/app/config/constants`;

    if (!this.tree.exists(modulePath)) {
      throw new Error(`Module file ${modulePath} not found`);
    }

    let moduleSource = this.tree.read(modulePath, 'utf-8')!;

    // Step 1: Add the import statement for the provider class if not present
    const providerImportRegex = new RegExp(
      `import\\s*{([^}]*)}\\s*from\\s*'${providerPath}';`
    );
    if (providerImportRegex.test(moduleSource)) {
      moduleSource = moduleSource.replace(
        providerImportRegex,
        (match, imports) => {
          const updatedImports = imports
            .split(',')
            .map((imp) => imp.trim())
            .filter((imp) => imp);
          if (!updatedImports.includes(providerClassName)) {
            updatedImports.push(providerClassName);
          }
          return `import { ${updatedImports.join(
            ', '
          )} } from '${providerPath}';`;
        }
      );
    } else {
      // Add new import statement if it doesn't exist
      moduleSource =
        `import { ${providerClassName} } from '${providerPath}';\n` +
        moduleSource;
    }

    // Step 2: Add the import statement for the token if not present
    const tokenImportRegex = new RegExp(
      `import\\s*{([^}]*)}\\s*from\\s*'${tokenPath}';`
    );
    if (tokenImportRegex.test(moduleSource)) {
      moduleSource = moduleSource.replace(
        tokenImportRegex,
        (match, imports) => {
          const updatedImports = imports
            .split(',')
            .map((imp) => imp.trim())
            .filter((imp) => imp);
          if (!updatedImports.includes(providerToken)) {
            updatedImports.push(providerToken);
          }
          return `import { ${updatedImports.join(', ')} } from '${tokenPath}';`;
        }
      );
    } else {
      moduleSource =
        `import { ${providerToken} } from '${tokenPath}';\n` + moduleSource;
    }

    // Step 3: Add the provider configuration to the @Module 'providers' array
    const providerConfig = `{
      provide: ${providerToken},
      useClass: ${providerClassName},
    }`;

    if (moduleSource.includes('providers: [')) {
      moduleSource = moduleSource.replace(
        /providers: \[([^\]]*)\]/,
        (match, providers) =>
          `providers: [${providers.trim()}${
            providers.trim() ? ',' : ''
          } ${providerConfig}]`
      );
    } else {
      moduleSource = moduleSource.replace(
        '@Module({',
        `@Module({\n  providers: [${providerConfig}],`
      );
    }

    // Step 4: Add the token to the 'exports' array
    if (moduleSource.includes('exports: [')) {
      moduleSource = moduleSource.replace(
        /exports: \[([^\]]*)\]/,
        (match, exports) =>
          `exports: [${exports.trim()}${
            exports.trim() ? ',' : ''
          } ${providerToken}]`
      );
    } else {
      moduleSource = moduleSource.replace(
        '@Module({',
        `@Module({\n  exports: [${providerToken}],`
      );
    }

    // Write the updated module source back to the file
    this.tree.write(modulePath, moduleSource);
  }

  private generateController() {
    this.addInConstants('controller');
    this.makeGenerateFile('controller', this.controllerTargetPath);

    this.mergeIndex(this.controllersPath);
    this.mergeTargetFolderIndex(
      'controller',
      `${this.controllersPath}/${this.folder}`
    );

    this.addControllerToModule();
  }

  private generateService() {
    this.addInConstants('service');
    this.makeGenerateFile('service', this.serviceTargetPath);
    this.mergeIndex(this.servicesPath);
    this.mergeTargetFolderIndex(
      'service',
      `${this.servicesPath}/${this.folder}`
    );
    const options = this.makeServiceToModuleOptions();
    this.addProviderToModule(options);
  }

  private makeRepoInterface() {
    const interfacePath = `${this.infraSrcPath}/shared/interface`;
    this.makeGenerateFile('i-repository', interfacePath);
    this.mergeIndex(interfacePath);
    this.mergeTargetFolderIndex(
      'interfaces',
      `${interfacePath}/${this.folder}`
    );
  }

  private makeRepository() {
    const repoPath = `${this.infraSrcPath}/shared/repositories`;
    this.addInConstants('repository');
    this.makeGenerateFile('repository', repoPath);
    this.mergeIndex(repoPath);
    this.mergeTargetFolderIndex('repositories', `${repoPath}/${this.folder}`);
    const options = this.makeRepositoryToModuleOptions();
    this.addProviderToModule(options);
  }

  private generateRepository() {
    this.makeRepoInterface();
    this.makeRepository();
  }

  static execute(tree: Tree, params: CreateNestFeatureGeneratorSchema) {
    const instance = new FeatureGenerator(tree, params);
    // instance.generateController();
    // instance.generateService();
    instance.generateRepository();
  }
}

export const createNestFeatureGenerator = (
  tree: Tree,
  params: CreateNestFeatureGeneratorSchema
) => FeatureGenerator.execute(tree, params);

export default createNestFeatureGenerator;
