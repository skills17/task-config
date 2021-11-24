import path from 'path';
import Config from '../../../src';

describe('config serve', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    expect(config.getServe()).toStrictEqual({
      enabled: true,
      port: 4000,
      bind: '0.0.0.0',
      mapping: {
        '/': './example',
        '/assets': './lib',
      },
    });
  });

  it('has default serve config', () => {
    const config = new Config();
    config.load({ id: 'serve-default', serve: { enabled: true } });

    expect(config.getServe()).toStrictEqual({
      enabled: true,
      port: 3000,
      bind: '127.0.0.1',
      mapping: {
        '/': './src',
      },
    });
  });
});
