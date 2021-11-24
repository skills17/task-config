import { Group, Override, Strategy, TestRun } from '@skills17/test-result';
import Serve from './types/Serve';
import Points from './types/Points';
import RawGroup from './types/RawGroup';

export default class Config {
  private id?: string;

  private source: string[] = ['./src/**'];

  private tests: string[] = ['./tests/**/*.spec.*', './tests/**/*.test.*'];

  private localHistory = false;

  private displayPoints = true;

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

  private metadata: Record<string, unknown> = {};

  /**
   * Load groups from the config.yaml file and create instances of @skills17/test-result
   *
   * @param groups Groups
   */
  private loadGroups(groups: RawGroup[]): Group[] {
    return groups.map((groupConfig: RawGroup, groupIndex) => {
      if (!groupConfig.match) {
        throw new Error(
          `config.yaml validation error: group #${groupIndex} does not contain a 'match' property`,
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
          `config.yaml validation error: property 'maxPoints' can only be set for strategy 'deduct'. Found in group #${groupIndex} (${groupConfig.match})`,
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
              `config.yaml validation error: test #${testIndex} in group #${groupIndex} (${groupConfig.match}) does not contain a 'match' property`,
            );
          }

          group.addOverride(new Override(testConfig.match, testConfig.required, testConfig.points));
        });
      }

      return group;
    });
  }

  /**
   * Initialize the class with values from the config file
   *
   * @param config Config object
   */
  public load(config: any): void { // eslint-disable-line
    // set config
    this.id = config.id;
    this.source = config.source ?? this.source;
    this.tests = config.tests ?? this.tests;
    this.localHistory = config.localHistory ?? this.localHistory;
    this.displayPoints = config.displayPoints ?? this.displayPoints;
    this.serve = { ...this.serve, ...config.serve };
    this.points = { ...this.points, ...config.points };
    this.groups = config.groups ?? this.groups;
    this.metadata = config.metadata ?? this.metadata;
  }

  /**
   * Create a new test run instance from @skills17/test-result for the current config
   */
  public createTestRun(): TestRun {
    const run = new TestRun();

    this.loadGroups(this.groups).forEach((group) => run.addGroup(group));

    return run;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getSource(): string[] {
    return this.source;
  }

  public getTests(): string[] {
    return this.tests;
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

  public getMetadata(): Record<string, unknown> {
    return this.metadata;
  }

  public isLocalHistoryEnabled(): boolean {
    return this.localHistory;
  }

  public arePointsDisplayed(): boolean {
    return this.displayPoints;
  }
}
