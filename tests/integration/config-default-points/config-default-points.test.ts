import path from 'path';
import { Strategy } from '@skills17/test-result';
import Config from '../../../src';

describe('config default points', () => {
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
      defaultPoints: 3.0,
      strategy: Strategy.Add,
    });
  });

  it('creates a new test run', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    const run = config.createTestRun();
    run.recordTest('AFoo', 'Foo', false, true); // 3 points
    run.recordTest('ABar', 'Bar', false, true); // 3 points
    run.recordTest('ABaz', 'Baz', false, false); // 0 points
    run.recordTest('BFoo', 'Foo', false, true); // 0.5 points
    run.recordTest('BBar', 'Bar', false, true); // 0.5 points
    run.recordTest('BBaz', 'Baz', false, false); // 0 points
    run.recordTest('CFoo', 'Foo', false, true); // 3 points
    run.recordTest('CLessPoints', 'LessPoints', false, true); // 2 points
    run.recordTest('CBaz', 'Baz', false, false); // 0 points
    run.recordTest('DFoo', 'Foo', false, true); // 1 point
    run.recordTest('DMorePoints', 'MorePoints', false, true); // 2 points
    run.recordTest('DBaz', 'Baz', false, false); // 0 points

    expect(JSON.parse(JSON.stringify(run))).toStrictEqual({
      testResults: [
        {
          group: 'A.+',
          points: 6,
          maxPoints: 9,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 3,
              maxPoints: 3,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 3,
              maxPoints: 3,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Baz',
              points: 0,
              maxPoints: 3,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'B.+',
          points: 1,
          maxPoints: 1.5,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Bar',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Baz',
              points: 0,
              maxPoints: 0.5,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'C.+',
          points: 5,
          maxPoints: 8,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'Foo',
              points: 3,
              maxPoints: 3,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'LessPoints',
              points: 2,
              maxPoints: 2,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'Baz',
              points: 0,
              maxPoints: 3,
              successful: false,
              required: false,
              manualCheck: false,
            },
          ],
        },
        {
          group: 'D.+',
          points: 3,
          maxPoints: 4,
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
              name: 'MorePoints',
              points: 2,
              maxPoints: 2,
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
      ],
    });
  });
});
