/* global describe, it, browser */
const assert = require('chai').assert

browser.timeouts('script', 60000)

const assertVisualMatch = (result, title) => {
  assert(result.isWithinMisMatchTolerance, `visual regression for ${title}`)
}

describe('Photos', function () {
  it('loads the timeline', function () {
    browser.url('cozy.local:8080')
    browser.setValue('[name=passphrase]', 'cozy')
    browser.click('#login-submit')
    browser.pause(2000)

    // Redirect from files.cozy.local:8080
    browser.url('app.cozy.local:8080')
    const results = browser.checkViewport()

    results.forEach(result => {
      assertVisualMatch(result, 'photos-timeline')
    })
  })
})
