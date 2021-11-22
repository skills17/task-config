import path from 'path';
import Config from '../../../src';

describe('config serve', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    expect(config.getServe()).toStrictEqual({
      enabled: true,
      port: 4000,
      bind: null,
      mapping: {
        '/': './example',
        '/assets': './lib',
      },
    });
  });
});
