import path from 'path';
import Config from '../../../src';

describe('config project root', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    expect(config.getProjectRoot()).toEqual(__dirname);
  });

  it('throws an error on an unloaded instance', () => {
    const config = new Config();

    expect(() => config.getProjectRoot()).toThrow('can only be called on a loaded config instance');
  });
});
