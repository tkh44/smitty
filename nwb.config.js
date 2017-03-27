module.exports = {
  type: 'react-component',
  polyfill: false,
  karma: {
    browsers: ['Chrome']
  },
  npm: {
    esModules: true,
    umd: {
      global: 'smitty',
      externals: {
        mitt: 'mitt'
      }
    }
  },
  babel: {
    loose: true,
    runtime: false
  },
  webpack: {
    uglify: {
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        booleans: true,
        unused: true,
        unsafe_proto: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }
  }
}
