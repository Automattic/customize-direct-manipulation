import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const prod = ( process.env.NODE_ENV === 'production' );

const commonConfig = {
	plugins: [
		resolve({
			browser: true,
		}),
		commonjs(),
		...( ! prod && [ eslint() ] ),
		babel({
			exclude: 'node_modules/**'
		}),
		...( prod && [ uglify() ] ),
	],
	external: [
		'jquery',
		'underscore',
		...( prod && [ 'debug' ] ),
	],
	globals: {
		jquery: 'window.jQuery',
		underscore: 'window._',
		...( prod && { debug: 'function(){ return window._.noop; }' } ),
	},
};

export default [
	Object.assign({
		input: 'src/admin.js',
		output: {
			file: 'js/customize-dm-admin.js',
			format: 'iife',
		},
	}, commonConfig),
	Object.assign({
		input: 'src/preview.js',
		output: {
			file: 'js/customize-dm-preview.js',
			format: 'iife',
		},
	}, commonConfig),
];