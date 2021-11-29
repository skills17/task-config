import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import findUp from 'find-up';
import yaml from 'js-yaml';
import Ajv, { AnySchema } from 'ajv';
import Config from './Config';

export default class NodeConfig extends Config {
  private configPath?: string;

  /**
   * Detect the path of the config.yaml file.
   * First, try it from the current file.
   * If that can't be found which is the case when installed using a symlink, try it from the cwd.
   */
  private static async detectPath(): Promise<string> {
    let configPath = await findUp('config.yaml', { cwd: __dirname });

    if (!configPath) {
      configPath = await findUp('config.yaml', { cwd: process.cwd() });
    }

    if (!configPath) {
      throw new Error('Config file does not exist');
    }

    return configPath;
  }

  /**
   * Detect the path of the config.yaml file synchronously.
   * First, try it from the current file.
   * If that can't be found which is the case when installed using a symlink, try it from the cwd.
   */
  private static detectPathSync(): string {
    let configPath = findUp.sync('config.yaml', { cwd: __dirname });

    if (!configPath) {
      configPath = findUp.sync('config.yaml', { cwd: process.cwd() });
    }

    if (!configPath) {
      throw new Error('Config file does not exist');
    }

    return configPath;
  }

  /**
   * Load the configuration from a file
   *
   * @param configPath Path of the config.yaml file, will be determined automatically if omitted
   */
  public async loadFromFile(configPath?: string): Promise<void> {
    this.configPath = configPath ?? (await NodeConfig.detectPath());

    // load yaml file
    const fileContent = await fsPromises.readFile(this.configPath);
    const config = yaml.load(fileContent.toString());

    this.validateSchema(config);
    this.load(config);
  }

  /**
   * Load the configuration from a file synchronously
   *
   * @param configPath Path of the config.yaml file, will be determined automatically if omitted
   */
  public loadFromFileSync(configPath?: string): void {
    this.configPath = configPath ?? NodeConfig.detectPathSync();

    // load yaml file
    const fileContent = fs.readFileSync(this.configPath);
    const config = yaml.load(fileContent.toString());

    this.validateSchema(config);
    this.load(config);
  }

  public getProjectRoot(): string {
    if (!this.configPath) {
      throw new Error('getProjectRoot() can only be called on a loaded config instance');
    }

    return path.dirname(this.configPath);
  }

  /**
   * Validate the config against the schema.
   *
   * @param config Config object
   */
  private validateSchema(config: any): void { // eslint-disable-line
    const schemaPath = path.join(__dirname, '..', 'config.schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath).toString());
    const validator = new Ajv({
      allErrors: true,
      strict: true,
      strictSchema: true,
      strictNumbers: true,
    });
    const validate = validator.compile(schema as AnySchema);

    if (!validate(config)) {
      throw new Error(
        `config.yaml did not pass validation: ${validator.errorsText(validate.errors)}`,
      );
    }
  }
}
