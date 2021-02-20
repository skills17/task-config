import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import findUp from 'find-up';
import Config from './Config';

export default class NodeConfig extends Config {
  private configPath?: string;

  /**
   * Detect the path of the config.json file.
   * First, try it from the current file.
   * If that can't be found which is the case when installed using a symlink, try it from the cwd.
   */
  private static async detectPath(): Promise<string> {
    let configPath = await findUp('config.json', { cwd: __dirname });

    if (!configPath) {
      configPath = await findUp('config.json', { cwd: process.cwd() });
    }

    if (!configPath) {
      throw new Error('Config file does not exist');
    }

    return configPath;
  }

  /**
   * Detect the path of the config.json file synchronously.
   * First, try it from the current file.
   * If that can't be found which is the case when installed using a symlink, try it from the cwd.
   */
  private static detectPathSync(): string {
    let configPath = findUp.sync('config.json', { cwd: __dirname });

    if (!configPath) {
      configPath = findUp.sync('config.json', { cwd: process.cwd() });
    }

    if (!configPath) {
      throw new Error('Config file does not exist');
    }

    return configPath;
  }

  /**
   * Load the configuration from a file
   *
   * @param configPath Path of the config.json file, will be determined automatically if omitted
   */
  public async loadFromFile(configPath?: string): Promise<void> {
    this.configPath = configPath ?? (await NodeConfig.detectPath());

    // load json file
    const fileContent = await fsPromises.readFile(this.configPath);
    this.load(JSON.parse(fileContent.toString()));
  }

  /**
   * Load the configuration from a file synchronously
   *
   * @param configPath Path of the config.json file, will be determined automatically if omitted
   */
  public loadFromFileSync(configPath?: string): void {
    this.configPath = configPath ?? NodeConfig.detectPathSync();

    // load json file
    const fileContent = fs.readFileSync(this.configPath);
    this.load(JSON.parse(fileContent.toString()));
  }

  public getProjectRoot(): string {
    if (!this.configPath) {
      throw new Error('getProjectRoot() can only be called on a loaded config instance');
    }

    return path.dirname(this.configPath);
  }
}
