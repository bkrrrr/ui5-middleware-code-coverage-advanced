![CI](https://github.com/bkrrrr/ui5-middleware-code-coverage-advanced/actions/workflows/CI.yml/badge.svg)
# ui5-middleware-code-coverage-advanced
A code instrumenter for UI5-tooling with baseline-support.
Middleware for [ui5-server](https://github.com/SAP/ui5-server), enabling code coverage.

- support inline sourcemaps
    - you can debug the instrumented code
- support clean 
    - clears ```.nyc_output``` on startup
- support baseline
   - creates file in ```.nyc_output/baseline.json```
   - your coverage report contains all js files, not just the one loaded during test


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
- extract the `window.__coverage__` during test run with your test-runner
  - [WDIO](https://webdriver.io/): [wdio-coverage-service](https://www.npmjs.com/package/wdio-coverage-service)
  - [Uiveri5](https://github.com/SAP/ui5-uiveri5) : TO MY KNOWLEDGE doesn't EXIST YET
  - [karma](https://github.com/karma-runner/karma): this is the test runner for OPA [karma-coverage](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md)