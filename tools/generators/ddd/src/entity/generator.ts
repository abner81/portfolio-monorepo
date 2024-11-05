import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { EntityGeneratorSchema } from './schema';
import {
  appendContent,
  convertToCamelCase,
  convertToKebabCase,
} from '@monorepo/helpers';

export async function entityGenerator(
  tree: Tree,
  options: EntityGeneratorSchema
) {
  const rawName = convertToKebabCase(options.name.replace(' ', ''));
  const entityName = rawName.startsWith('-') ? rawName.slice(1) : rawName;

  const entitiesPath = `apps/${convertToKebabCase(
    options.project
  )}/src/entities`;

  const targetPath = `${entitiesPath}/${convertToKebabCase(entityName)}`;

  generateFiles(tree, path.join(__dirname, 'files'), targetPath, {
    name: convertToKebabCase(entityName),
    tmpl: '',
    convertToCamelCase,
  });

  appendContent(
    tree,
    `${entitiesPath}/index.ts`,
    `export * from "./${convertToKebabCase(entityName)}"`
  );

  appendContent(
    tree,
    `${targetPath}/index.ts`,
    `export * from "./${convertToKebabCase(entityName)}"`
  );

  await formatFiles(tree);
}

export default entityGenerator;
