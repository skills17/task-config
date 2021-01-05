import path from 'path';
import { Strategy } from '@skills17/test-result';
import Config from '../../../src/Config';

describe('config default points', () => {
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
      defaultPoints: 3.0,
      strategy: Strategy.Add,
    });
  });

  it('creates a new test run', async () => {
    const config = new Config();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    const run = config.createTestRun();
    run.recordTest('AFoo', false, true); // 3 points
    run.recordTest('ABar', false, true); // 3 points
    run.recordTest('ABaz', false, false); // 0 points
    run.recordTest('BFoo', false, true); // 0.5 points
    run.recordTest('BBar', false, true); // 0.5 points
    run.recordTest('BBaz', false, false); // 0 points
    run.recordTest('CFoo', false, true); // 3 points
    run.recordTest('CLessPoints', false, true); // 2 points
    run.recordTest('CBaz', false, false); // 0 points
    run.recordTest('DFoo', false, true); // 1 point
    run.recordTest('DMorePoints', false, true); // 2 points
    run.recordTest('DBaz', false, false); // 0 points

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
              name: 'AFoo',
              points: 3,
              maxPoints: 3,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'ABar',
              points: 3,
              maxPoints: 3,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'ABaz',
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
              name: 'BFoo',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'BBar',
              points: 0.5,
              maxPoints: 0.5,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'BBaz',
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
              name: 'CFoo',
              points: 3,
              maxPoints: 3,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'CLessPoints',
              points: 2,
              maxPoints: 2,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'CBaz',
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
              name: 'DFoo',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'DMorePoints',
              points: 2,
              maxPoints: 2,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'DBaz',
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
