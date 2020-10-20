const typescript = require('rollup-plugin-typescript');
const copy = require('rollup-plugin-copy');
const livereload =  require('rollup-plugin-livereload')
const serve =  require('rollup-plugin-serve')

module.exports = {
    input: 'src/index.ts',
    output: {
      file: 'docs/js/bundle.js',
      format: 'umd',
      name: 'projectbundle',
      sourcemap: true
    },
    plugins: [
        typescript(),
        copy({
            targets: [
                'src/www/index.html',
                'src/www/style.css'
            ],
            outputFolder:'docs'
        }),
        // serve('docs'),
        // livereload()
    ]
};
