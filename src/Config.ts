import { promises as fs } from 'fs';
import findUp from 'find-up';
import { Group, Override, Strategy, TestRun } from '@skills17/test-result';
import Serve from './types/Serve';
import Points from './types/Points';
import RawGroup from './types/RawGroup';

export default class Config {
  private id?: string;

  private type?: string;

  private source: string[] = ['./src/**'];

  private serve: Serve = {
    enabled: false,
    port: 3000,
    bind: '127.0.0.1',
    mapping: {
      '/': './src',
    },
  };

  private points: Points = {
    defaultPoints: 1.0,
    strategy: Strategy.Add,
  };

  private groups: RawGroup[] = [];

  /**
   * Detect the path of the config.json file.
   * First, try it from the current file.
   * If that can't be found which is the case when installed using a symlink, try it from the cwd.
   */
  private static async detectPath(): Promise<string> {
    let path = await findUp('config.json', { cwd: __dirname });

    if (!path) {
      path = await findUp('config.json', { cwd: process.cwd() });
    }

    if (!path) {
      throw new Error('Config file does not exist');
    }

    return path;
  }

  /**
   * Load groups from the config.json file and create instances of @skills17/test-result
   *
   * @param groups Groups
   */
  private loadGroups(groups: RawGroup[]): Group[] {
    return groups.map((groupConfig: RawGroup, groupIndex) => {
      if (!groupConfig.match) {
        throw new Error(
          `config.json validation error: group #${groupIndex} does not contain a 'match' property`,
        );
      }

      const defaultPoints =
        typeof groupConfig.defaultPoints !== 'undefined'
          ? groupConfig.defaultPoints
          : this.points.defaultPoints;
      const strategy =
        typeof groupConfig.strategy !== 'undefined'
          ? (groupConfig.strategy as Strategy)
          : this.points.strategy;

      if (typeof groupConfig.maxPoints !== 'undefined' && strategy !== Strategy.Deduct) {
        throw new Error(
          `config.json validation error: property 'maxPoints' can only be set for strategy 'deduct'. Found in group #${groupIndex} (${groupConfig.match})`,
        );
      }

      // create group instance
      const group = new Group(
        groupConfig.match,
        defaultPoints,
        strategy,
        groupConfig.displayName,
        groupConfig.maxPoints,
      );

      // add test overrides
      if (groupConfig.tests && Array.isArray(groupConfig.tests)) {
        groupConfig.tests.forEach((testConfig, testIndex) => {
          if (!testConfig.match) {
            throw new Error(
              `config.json validation error: test #${testIndex} in group #${groupIndex} (${groupConfig.match}) does not contain a 'match' property`,
            );
          }

          group.addOverride(new Override(testConfig.match, testConfig.required, testConfig.points));
        });
      }

      return group;
    });
  }

  /**
   * Load the configuration from a file
   *
   * @param path Path of the config.json file, will be determined automatically if omitted
   */
  public async loadFromFile(path?: string): Promise<void> {
    const resolvedPath = path ?? (await Config.detectPath());

    // load json file
    const fileContent = await fs.readFile(resolvedPath);
    const config = JSON.parse(fileContent.toString());

    // set config
    this.id = config.id;
    this.type = config.type;
    this.source = config.source ?? this.source;
    this.serve = { ...this.serve, ...config.serve };
    this.points = { ...this.points, ...config.points };
    this.groups = config.groups ?? this.groups;
  }

  /**
   * Create a new test run instance from @skills17/test-run for the current config
   */
  public createTestRun(): TestRun {
    const run = new TestRun();

    this.loadGroups(this.groups).forEach((group) => run.addGroup(group));

    return run;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getType(): string | undefined {
    return this.type;
  }

  public getSource(): string[] {
    return this.source;
  }

  public getServe(): Serve {
    return this.serve;
  }

  public getPoints(): Points {
    return this.points;
  }

  public getGroups(): RawGroup[] {
    return this.groups;
  }
}
