import path from 'path';
import Config from '../../../src';

describe('config meta', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    expect(config.getId()).toEqual('js-task-1');
    expect(config.getType()).toEqual('js');
  });
});
