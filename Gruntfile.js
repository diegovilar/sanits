var utils = require('./build-utils');

module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var buildTime = new Date();
    var buildTimeString = buildTime.toISOString();
    var version = utils.version.parse(pkg.version);
    var versionString = utils.version.getCacheKey(version);
    var srcDir = 'src';
    var testDir = 'test';
    var debugDir = 'debug';
    var buildDir = 'build';
    var distDir = 'dist';
    var filesToPreprocess = 'ts,js,css,xhtml,html,htm,txt,TXT,xml';

    function generateBanner(target) {
        target = target ? target + ' ' : '';
        return '/**\n' +
            ' * <%= pkg.projectName %> v<%= version.versionString %> ' + target + '(built on <%= version.buildTimeString %>)\n' +
            ' */\n';
    }

    grunt.util.linefeed = '\n';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: pkg,

        version: {
            version: version.version,
            versionString: versionString,
            buildTime: buildTime,
            buildTimeString: buildTimeString
        },

        srcDir: srcDir,
        debugDir: debugDir,
        buildDir: buildDir,
        testDir: testDir,
        distDir: distDir,

        clean: {
            dist: [distDir + '/*'],
            build: [buildDir + '/*'],
            debug: [debugDir + '/*']
        },

        run: {
            debug: {
                exec: 'node_modules\\.bin\\tsc.cmd -d -t ES3 -m commonjs --noImplicitAny --noEmitOnError --sourceMap --out ' +
                    debugDir + '\\sanits.js ' +
                    srcDir + '\\main.ts'
            },
            build: {
                exec: 'node_modules\\.bin\\tsc.cmd -d -t ES3 -m commonjs --noImplicitAny --noEmitOnError --out ' +
                buildDir + '\\sanits.js ' +
                srcDir + '\\main.ts'
            }
        },

        karma: {
            options: {
                basePath: '',
                frameworks: ['jasmine', 'source-map-support'],
                runnerPort: 9876,
                debounceDelay: 3000,
                colors: true,
                autoWatch: false,
                singleRun: false,
                logLevel: 'INFO',
                browsers: ['Chrome'],
                reporters: ['progress'/*, 'coverage'*/],
                files: [
                    // libraries

                    // tested code
                    { pattern: 'debug/**/*.js', watched: false },
                    { pattern: 'debug/**/*.js.map', watched: false, included: false },
                    { pattern: 'src/**/*.ts', watched: false, included: false },

                    // test specs
                    { pattern: 'test/**/*.test.js', watched: false },
                    { pattern: 'test/**/*.test.ts', watched: false, included: false },
                    { pattern: 'test/**/*.test.js.map', watched: false, included: false }
                ],
                exclude: [],
                preprocessors: {}
            },
            server: {
                background: false
            },
            runner: {
                background: true
            }
        },

        watch: {
            karmaWatcher: {
                files: [
                    srcDir + '/**/*.js',
                    testDir + '/**/*.js'
                ],
                tasks: [
                    'debug',
                    'karma:runner:run'
                ]
            }
        },

        replace: {
            build: {
                src: [
                    '<%= buildDir %>/**/*.{' + filesToPreprocess + '}'
                ],
                overwrite: true,
                replacements: [
                    {
                        from: "$PROJECT_NAME$",
                        to: "<%= pkg.projectName %>"
                    }, {
                        from: "$PROJECT_HOMEPAGE$",
                        to: "<%= pkg.homepage %>"
                    }, {
                        from: "$PROJECT_VERSION$",
                        to: "<%= version.versionString %>"
                    }, {
                        from: "$PROJECT_TARGET$",
                        to: "production"
                    }, {
                        from: "$PROJECT_BUILD_TIME$",
                        to: "<%= version.buildTimeString %>"
                    }, {
                        from: "$PROJECT_LICENSE$",
                        to: "<%= pkg.license %>"
                    }
                ]
            },
            debug: {
                src: [
                    '<%= debugDir %>/**/*.{' + filesToPreprocess + '}'
                ],
                overwrite: true,
                replacements: [
                    {
                        from: "$PROJECT_NAME$",
                        to: "<%= pkg.projectName %>"
                    }, {
                        from: "$PROJECT_HOMEPAGE$",
                        to: "<%= pkg.homepage %>"
                    }, {
                        from: "$PROJECT_VERSION$",
                        to: "<%= version.versionString %>"
                    }, {
                        from: "$PROJECT_TARGET$",
                        to: "development"
                    }, {
                        from: "$PROJECT_BUILD_TIME$",
                        to: "<%= version.buildTimeString %>"
                    }, {
                        from: "$PROJECT_LICENSE$",
                        to: "<%= pkg.license %>"
                    }
                ]
            }
        },

        uglify: {
            build: {
                options: {
                    report: 'gzip',
                    mangle: {},
                    compress: {
                        drop_console: true
                    },
                    preserveComments: 'false',
                    banner: generateBanner('PRODUCTION')
                },
                files: {
                    '<%= buildDir %>/sanits.min.js': [
                        '<%= buildDir %>/sanits.js'
                    ]
                }
            }
        },

        compress: {
            dist: {
                options: {
                    archive: '<%= distDir %>/<%= pkg.name %>-<%= version.versionString %>.zip'
                },
                files: [
                    {expand: true, cwd: buildDir, src: ['**']}
                ]
            }
        }

    });

    grunt.registerTask('karmaServer', [
        'karma:server:start'
    ]);

    grunt.registerTask('karmaWatcher', [
        'watch:karmaWatcher'
    ]);

    grunt.registerTask('debug', [
        'clean:debug',
        'run:debug',
        'replace:debug'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'run:build',
        'replace:build',
        'uglify:build'
    ]);

    //grunt.registerTask('dist', [
    //    'build',
    //    'clean:dist',
    //    'compress:dist'
    //]);

    grunt.registerTask('default', 'debug');
};
