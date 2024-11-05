import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import {
  appendContent,
  convertToCamelCase,
  convertToKebabCase,
} from '@monorepo/helpers';
import { ValueObjectGeneratorSchema } from './schema';

const parseName = (name: string) => {
  const rawName = convertToKebabCase(name.replace(' ', ''));
  return rawName.startsWith('-') ? rawName.slice(1) : rawName;
};

export async function entityGeneratorGenerator(
  tree: Tree,
  options: ValueObjectGeneratorSchema
) {
  const valueObjectName = parseName(options.name);
  const entityFilename = parseName(options.entityFilename);

  let partialPath = `apps/${convertToKebabCase(options.project)}/src`;
  if (entityFilename) partialPath += `/entities/${entityFilename}`;

  const targetPath = `${partialPath}/value-objects/${valueObjectName}`;

  generateFiles(tree, path.join(__dirname, 'files'), targetPath, {
    name: valueObjectName,
    tmpl: '',
    convertToCamelCase,
  });

  appendContent(
    tree,
    `${partialPath}/value-objects/index.ts`,
    `export * from "./${valueObjectName}/${valueObjectName}"`
  );

  appendContent(
    tree,
    `${partialPath}/index.ts`,
    `export * from "./value-objects"`
  );

  await formatFiles(tree);
}

export default entityGeneratorGenerator;
