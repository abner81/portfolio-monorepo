import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { EntityGeneratorSchema } from './schema';
import {
  appendContent,
  convertToCamelCase,
  convertToKebabCase,
} from '@monorepo/helpers';

export async function entityGeneratorGenerator(
  tree: Tree,
  options: EntityGeneratorSchema
) {
  const entitiesPath = `apps/${convertToKebabCase(
    options.project
  )}/domain/${convertToKebabCase(options.context)}/src/entities`;

  const targetPath = `${entitiesPath}/${convertToKebabCase(options.name)}`;

  generateFiles(tree, path.join(__dirname, 'files'), targetPath, {
    name: convertToKebabCase(options.name),
    tmpl: '',
    convertToCamelCase,
  });

  appendContent(
    tree,
    `${entitiesPath}/index.ts`,
    `export * from "./${convertToKebabCase(options.name)}"`
  );

  appendContent(
    tree,
    `${targetPath}/index.ts`,
    `export * from "./${convertToKebabCase(options.name)}"`
  );

  await formatFiles(tree);
}

export default entityGeneratorGenerator;
