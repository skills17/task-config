import path from 'path';
import { Strategy } from '@skills17/test-result';
import Config from '../../../src/Config';

describe('config display name', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    expect(config.getSource()).toStrictEqual(['./src/**']);
    expect(config.getServe()).toStrictEqual({
      enabled: false,
      port: 3000,
      bind: '127.0.0.1',
      mapping: {
        '/': './src',
      },
    });
    expect(config.getPoints()).toStrictEqual({
      defaultPoints: 1.0,
      strategy: Strategy.Add,
    });
  });

  it('creates a new test run', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    const run = config.createTestRun();
    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('CFoo', false, true);

    expect(JSON.parse(JSON.stringify(run))).toStrictEqual({
      testResults: [
        {
          group: 'A.+',
          points: 1,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'AFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'BGroup::foo',
          points: 1,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'BFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'Last group',
          points: 1,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'CFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ],
    });
  });
});
