import path from 'path';
import Config from '../../../src';

describe('config local history', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    expect(config.isLocalHistoryEnabled()).toEqual(true);
  });
});
