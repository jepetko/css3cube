'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('css3cube.jquery.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            jquery : {
                src: ['libs/jquery/jquery.js'],
                dest: 'build/jquery.js'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        //qunit: {
        //    files: ['test/**/*.html']
        //},
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        },
        modernizr: {

            // [REQUIRED] Path to the build you're using for development.
            "devFile": "node_modules/grunt-modernizr/lib/modernizr-dev.js",

            // [REQUIRED] Path to save out the built file.
            "outputFile": "build/modernizr-custom.js",

            // Based on default settings on http://modernizr.com/download/
            "extra": {
                "shiv": true,
                "printshiv": false,
                "load": true,
                "mq": false,
                "cssclasses": true
            },

            // Based on default settings on http://modernizr.com/download/
            "extensibility": {
                "addtest": false,
                "prefixed": false,
                "teststyles": false,
                "testprops": false,
                "testallprops": false,
                "hasevents": false,
                "prefixes": false,
                "domprefixes": false
            },

            // By default, source is uglified before saving
            "uglify": true,

            // Define any tests you want to impliticly include.
            "tests": [],

            // By default, this task will crawl your project for references to Modernizr tests.
            // Set to false to disable.
            "parseFiles": true,

            // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
            // You can override this by defining a "files" array below.
            // "files" : [],

            // When parseFiles = true, matchCommunityTests = true will attempt to
            // match user-contributed tests.
            "matchCommunityTests": false,

            // Have custom Modernizr tests? Add paths to their location here.
            "customTests": []
        },
        jasmine: {
            test: {
                src: ["build/jquery.js", "build/modernizr-custom.js", 'src/**/*.js'],
                options: {
                    specs: 'specs/*spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    //Note: require js doesn't work. don't know why... everything installed as described.
                    templateOptions: {
                        requireConfig: {
                            paths: {
                                jquery: "build/jquery.js"
                            }
                        }
                    }
                }
            }
        },
        release: {
            options: {
                npm: false,
                tagName: '<%= version %>',
                commitMessage: 'first release of css3cube <%= version %>',
                tagMessage: 'tagging version <%= version %>'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-release');

    // Default task.
    grunt.registerTask('default', ['jshint', 'jasmine:test', 'clean', 'concat', 'uglify:jquery', 'uglify:dist']);

    // extra test task
    grunt.registerTask('test', ['jshint', 'jasmine:test']);
};