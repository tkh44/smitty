// eslint-disable-next-line no-unused-vars
/** @jsx h */
import { render, h } from 'preact'

let root
function run () {
  const Root = require('./App').default
  root = render(<Root test={'foo'}/>, document.querySelector('#demo'), root)
}

run()

if (module.hot) {
  // Whenever a new version of App.js is available
  module.hot.accept('./App', function () {
    // Require the new version and render it instead
    run()
  })
}
