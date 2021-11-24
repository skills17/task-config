import path from 'path';
import Config from '../../../src';

describe('validation missing required', () => {
  it('fails validation', async () => {
    const config = new Config();

    await expect(config.loadFromFile(path.resolve(__dirname, 'config.yaml'))).rejects.toThrow(
      /^config\.yaml did not pass validation: data must have required property 'id'$/,
    );
  });
});
