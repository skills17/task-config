import path from 'path';
import Config from '../../../src/Config';

describe('config source', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    expect(config.getSource()).toStrictEqual(['./src/main.js', './src/main.css']);
  });
});
