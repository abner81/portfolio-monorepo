import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { createNestFeatureGenerator } from './generator';
import { CreateNestFeatureGeneratorSchema } from './schema';

describe('Create Nest Feature generator', () => {
  let tree: Tree;
  const options: CreateNestFeatureGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await createNestFeatureGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
