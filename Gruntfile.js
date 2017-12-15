module.exports = function( grunt ) {
	require( 'load-grunt-tasks' )( grunt );

	grunt.initConfig( {
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				},
				transform: ['babelify']
			},
			devAdmin: {
				files: {
					'js/customize-dm-admin.js': 'src/admin.js'
				}
			},
			devPreview: {
				files: {
					'js/customize-dm-preview.js': 'src/preview.js'
				}
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: [ 'babel-register' ]
				},
				src: [ 'test/**/*.js' ]
			}
		},
		uglify: {
			dist: {
				options: {
					maxLineLen: 2048
				},
				files: {
					'js/customize-dm-admin.js': 'js/customize-dm-admin.js',
					'js/customize-dm-preview.js': 'js/customize-dm-preview.js'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: [ 'src/**/*.js' ],
				tasks: [ 'browserify:devPreview', 'browserify:devAdmin' ]
			},
		},
	} );

	grunt.registerTask( 'default', [ 'browserify:devPreview', 'browserify:devAdmin', 'watch' ] );
	grunt.registerTask( 'dist', [ 'browserify:devPreview', 'browserify:devAdmin', 'uglify:dist' ] );
	grunt.registerTask( 'test', [ 'mochaTest' ] );
};

