import path from 'path';
import Config from '../../../src';

describe('validation successful', () => {
  it('passes validation', async () => {
    const config = new Config();

    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));
  });
});
