# skills17/task-config

Parses and validates task config files.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Browser](#browser)
- [Configuration](#configuration)
- [License](#license)

## Installation

```bash
npm install @skills17/task-config
```

## Usage

Create a `config.yaml` file for your task in the root folder of the task.
See the [configuration](#configuration) section below for a detailed overview of all possible configuration values.

Then, create a new config instance and load the configuration file:

```typescript
import Config from '@skills17/task-config';

const config = new Config();
await config.loadFromFile();
```

To load the config synchronously, the additional method `loadFromFileSync()` is available.

You can now access the configuration via the available getter methods:
- `getId()`
- `getType()`
- `getSource()`
- `getServe()`
- `getPoints()`
- `getGroups()`
- `getProjectRoot()`
- `isLocalHistoryEnabled()`
- `arePointsShown()`

Or directly create a new test run instance (from [`@skills17/test-result`](https://github.com/skills17/test-result)) where you can start recording the tests:

```typescript
const run = config.createTestRun();

// start recording tests
run.recordTest('Countries > IndexAll', 'IndexAll', false, true);
```

### Browser

It is also possible to use this library in a browser.
Webpack and other bundlers should automatically pick the correct files.
If you are not using a bundler, make sure to use the `lib/index.browser.js` file.

Since the browser does not have access to the filesytem, it cannot load the `config.yaml` automatically.
Instead, you have to pass the configuration object directly to the load method:

```typescript
import Config from '@skills17/task-config';

const config = new Config();
await config.load({ points: { defaultPoints: 2 }, groups: [ /* ... */ ] });
```

From then on, the same methods can be used as within a node environment, except the `getProjectRoot()`
method is not available.

## Configuration

The following properties are available and can be set in the `config.yaml` file.

#### `id: string`

Uniquely identifies the task within one championship.

#### `type: string`

Defines the task type so they can later be grouped.
For example, task types can be their programming language (`js`, `php`, ...).

#### `source: string[]`

Default: `["./src/**"]`

Specifies all source files the competitors are allowed to modify.
All files that do not match will get reset before a test.

The files can be specified by using [minimatch globs](https://www.npmjs.com/package/minimatch).

#### `tests: string[]`

Default: `["./tests/**/*.@(spec|test).@(js|ts)"]`

Some skills17 packages require all test files to be specified.
If that is the case, it will be stated in the install instructions.

The files can be specified by using [minimatch globs](https://www.npmjs.com/package/minimatch).

#### `database: Database`

Default:
```yaml
database:
  enabled: false
  dump: ./database.sql
  name: skills17
  user: root
  password: ''
  host: 127.0.0.1
```

Defines if a database is used by the tests and if that is the case, which one.
The dump file specifies the location of a valid SQL Dump that will get automatically imported before every test run in order to ensure consistent data across test runs.

#### `serve: Serve`

Default:
```yaml
serve:
  enabled: false
  port: 3000
  bind: 127.0.0.1
  mapping:
    /: ./src
```

Some integration tests require that files are accessible over an URL.
If this feature is enabled, the files or directories specified in the `mapping` property will be served on the defined endpoint.
The key specifies the URL path and the value the local file path.

#### `localHistory: boolean`

Default: `false`

If true, every executed test run will be saved in JSON locally in a `.history` folder.
This later allows a performance analysis over time.

#### `showPoints: boolean`

Default: `true`

If false, points will not be shown in the normal output.
For JSON outputs, they will still be available.

#### `points: Points`

Default:
```yaml
points:
  defaultPoints: 1
  strategy: add
```

Those settings define how many points a test will award by default and which strategy will be used.
Valid strategies are `add` and `deduct`.
Those values can be overwritten by a single test or test group.

#### `groups: Group[]`

Default: `[]`

A core concept is test groups.
You usually don't want to test everything for one criterion in one test function but instead split it into multiple ones for a cleaner test class and a better overview.

Each test group can have the following configuration:
```yaml
groups:
  # A regex to match tests of this group. For JS, groups are determined
  # by `describe` statements, for PHP, it is specified as a test method prefix.
  match: CountriesIndex.+

  # An optional display name will be used in all outputs.
  displayName: CountriesController::index

  # Optionally sets the default points tests will award in this group.
  # Only needed when overwriting the global default value.
  defaultPoints: 1

  # Optionally sets the strategy used in this group.
  # Only needed when overwriting the global default value.
  strategy: deduct

  # Optionally sets the maximum number of points that can be scored in this group.
  # This can only be set when the strategy "deduct" is used and the maximum points
  # should not equal the sum of all tests.
  maxPoints: 3

  # Optionally define overrides for single tests.
  tests:
    # A regex to match the test inside this group.
    # If the default values are okay for a test, it does not need to be specified here.
  - match: CountriesIndexJson

    # Optionally specify points per test if they should be different from the default points.
    points: 0

    # Optionally set this as a required test.
    # If a required test does not pass, the whole group will award 0 points.
    required: true
```

### Full example

Many of the values in this example are default values and can be left out.
But it shows how a full `config.yaml` can look like and what settings are available.

```yaml
id: js-task-1
type: js
source:
- ./src/**
database:
  enabled: true
  dump: ./database.sql
  name: skills17
  user: root
  password: ''
  host: 127.0.0.1
serve:
  enabled: true
  port: 3000
  bind: 127.0.0.1
  mapping:
    /: ./src
localHistory: false
showPoints: true
points:
  defaultPoints: 1
  strategy: add
groups:
- match: CountriesIndex.+
  displayName: CountriesController::index
  defaultPoints: 1
  strategy: deduct
  maxPoints: 2
  tests:
  - match: CountriesIndexJson
    points: 0
    required: true
  - match: CountriesIndexSearch
    points: 2
```

## License

[MIT](https://github.com/skills17/task-config/blob/master/LICENSE)
