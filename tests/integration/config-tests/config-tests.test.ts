import path from 'path';
import Config from '../../../src';

describe('config tests', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    expect(config.getTests()).toStrictEqual(['./src/tests/**', './test.html']);
  });
});
