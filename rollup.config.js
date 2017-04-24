import buble from 'rollup-plugin-buble'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  entry: 'src/index.js',
  useStrict: false,
  sourceMap: true,
  plugins: [buble()],
  targets: [
    {dest: pkg.main, format: 'cjs'},
    {dest: pkg.module, format: 'es'},
    {dest: pkg['umd:main'], format: 'umd', moduleName: pkg.name}
  ]
}
