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
		copytotheplace: {
			all: [ 'css', 'js', 'customize-direct-manipulation.php' ]
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: [ 'src/**/*.js' ],
				tasks: [ 'browserify:devPreview', 'browserify:devAdmin', 'copytotheplace' ]
			},
			php: {
				files: [ 'customize-direct-manipulation.php' ],
				tasks: [ 'copytotheplace' ]
			},
			css: {
				files: [ 'css/*.css' ],
				tasks: [ 'copytotheplace' ]
			}
		}
	} );

	grunt.registerTask( 'default', [ 'browserify:devPreview', 'browserify:devAdmin', 'copytotheplace', 'watch' ] );
	grunt.registerTask( 'dist', [ 'browserify:devPreview', 'browserify:devAdmin', 'uglify:dist', 'copytotheplace' ] );
	grunt.registerTask( 'test', [ 'mochaTest' ] );
};

