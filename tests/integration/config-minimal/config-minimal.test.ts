import path from 'path';
import { Strategy } from '@skills17/test-result';
import Config from '../../../src';

describe('config minimal', () => {
  it('loads the config file', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

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
    expect(config.isLocalHistoryEnabled()).toEqual(false);
    expect(config.arePointsDisplayed()).toEqual(true);
  });

  it('creates a new test run', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    const run = config.createTestRun();
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BBaz', 'Baz', false, false);
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CBar', 'Bar', false, true);
    run.recordTest('DFoo', 'Foo', false, false);
    run.recordTest('EFoo', 'Foo', false, false);
    run.recordTest('EBar', 'Bar', false, false);

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
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'B.+',
          points: 2,
          maxPoints: 3,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Baz',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'C.+',
          points: 2,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'D.+',
          points: 0,
          maxPoints: 1,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'E.+',
          points: 0,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0,
              maxPoints: 1,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ],
    });
  });
});
