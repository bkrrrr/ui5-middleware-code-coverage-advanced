![CI](https://github.com/bkrrrr/ui5-middleware-code-coverage-advanced/actions/workflows/CI.yml/badge.svg)
# ui5-middleware-code-coverage-advanced
A code instrumenter middleware for [ui5-server](https://github.com/SAP/ui5-server), enabling code coverage on the fly.

- support inline source maps
    - you can debug the instrumented code
- support clean 
    - clears ```.nyc_output``` on startup
- support baseline
   - creates file in ```.nyc_output/baseline.json```
   - your coverage report contains all js files, not just the one loaded during test

>Inspired by [ui5-middleware-code-coverage](https://www.npmjs.com/package/ui5-middleware-code-coverage).
## Component-preload.js
Component-preload has up to today [no source maps](https://github.com/SAP/ui5-builder/pull/695#pullrequestreview-889727544). Therefore this plugin supports currently only apps server from the standard folder ```webapp```.

There is no way to map the coverage back the the original source.

## Install

```bash
npm install ui5-middleware-code-coverage-advanced --save-dev
```

## Usage - UI5-Tooling

1. Define the dependency in `$yourApp/package.json`:

    ```json
    "devDependencies": {
        "ui5-middleware-code-coverage-advanced": "*"
    },
    "ui5": {
      "dependencies": [
        "ui5-middleware-code-coverage-advanced"
      ]
    }
    ```

2. configure it in `$yourApp/ui5.yaml`:

    ```yaml
    server:
      customMiddleware:
      - name: ui5-middleware-code-coverage-advanced
        afterMiddleware: compression
        mountPath: /
        configuration:
          enabled: true
    ```
## Usage - Test-Runner
Extract the `window.__coverage__` during test run with your test-runner.


| Test-Rummer | Plugin | Description | Deprecated |
| --- | --- | --- | --- |
| [WDIO](https://webdriver.io/) | [wdio-coverage-service](https://www.npmjs.com/package/wdio-coverage-service) | not needed if you don't care about baseline |  |
| [Uiveri5](https://github.com/SAP/ui5-uiveri5) |   | TO MY KNOWLEDGE NOT EXISTING | :warning: |
| [Karma](https://github.com/SAP/ui5-uiveri5) |  [karma-coverage](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md) |Test runner used by OPA | :warning: |

### WDIO
This works [now native](https://webdriver.io/docs/devtools-service#capture-code-coverage), no need for any middleware or plugins(but no baseline support), simply do:
```
services: [
		["devtools", {
			coverageReporter: {
				enable: true,
				type: "lcov",
				logDir: __dirname + "/coverage",
				exclude: [/resources/]
			}
		}]
	],
```
