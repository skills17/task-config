import path from 'path';
import Config from '../../../src/Config';

describe('config local history', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    expect(config.isLocalHistoryEnabled()).toEqual(true);
  });
});
