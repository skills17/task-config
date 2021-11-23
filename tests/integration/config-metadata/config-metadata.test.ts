import path from 'path';
import Config from '../../../src';

describe('config metadata', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    expect(config.getMetadata()).toStrictEqual({
      foo: 'bar',
      url: 'http://localhost/tests.html',
    });
  });
});
