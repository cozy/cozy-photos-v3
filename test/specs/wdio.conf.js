// WebdriverIO configuration filen
// See http://webdriver.io/guide/testrunner/configurationfile.html
var path = require('path')
var VisualRegressionCompare = require('wdio-visual-regression-service/compare')

function getScreenshotName (basePath) {
  return function (context) {
    var type = context.type
    var testName = context.test.title
    var width = context.meta.width
    var browserVersion = parseInt(context.browser.version, 10)
    var browserName = context.browser.name
    return path.join(basePath, `${testName}_${type}_${browserName}_v${browserVersion}_w${width}.png`)
  }
}

exports.config = {
  host: 'localhost',
  port: 4444,
  path: '/wd/hub',
  specs: [
    './**/*.js'
  ],
  exclude: [
    './wdio.conf.js'
  ],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome'
  }],
  sync: true,
  logLevel: 'verbose',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './__screenshots__/errorShots',
  baseUrl: 'http://cozy.local',
  waitforTimeout: 30000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: [
    'visual-regression'
  ],
  visualRegression: {
    compare: new VisualRegressionCompare.LocalCompare({
      referenceName: getScreenshotName(path.join(process.cwd(), './__screenshots__/reference')),
      screenshotName: getScreenshotName(path.join(process.cwd(), './__screenshots__/screen')),
      diffName: getScreenshotName(path.join(process.cwd(), './__screenshots__/diff')),
      misMatchTolerance: 0.01
    }),
    viewportChangePause: 300,
    widths: [320, 640, 1024],
    orientations: ['landscape']
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    compilers: ['js:babel-register'],
    require: ['babel-polyfill'],
    timeout: 60000
  }
}
