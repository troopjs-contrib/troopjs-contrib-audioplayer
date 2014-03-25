/*global module:false*/
module.exports = function (grunt) {

  var path = require('path');
  require("load-grunt-tasks")(grunt);

  grunt.registerTask("default", [
    //'jshint:source',
    'clean:dist',
    'concurrent:dist',
    'copy:dist',
    'requirejs-transformconfig:dist',
    'requirejs',
    'uglify'
  ]);

  grunt.registerTask('release', [
    'clean:release',
    'default',
    'copy:release'
  ]);

  grunt.registerTask('serve', function () {
    grunt.task.run([
      'clean:dist',
      'less',
      'concurrent:dist',
      'connect:livereload',
      'watch'
    ]);
  });

  function includeSource(patterns) {
    return grunt.util._.map(grunt.file.expand(patterns), function (file) {
      return ['<%= pkg.name %>', file.replace(/\.js$/, '')].join('/');
    });
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowerDir: 'bower_components',
    clean: {
      dist: 'dist/',
      release: 'release/'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      source: {
        src: ['Gruntfile.js', 'main.js', 'widget/**/*.js']
      },
      spec: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/*.spec.js']
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            src: ['example/css/{,*/}*.css','example/{,*/}*.html', 'widget/**', 'img/**', '<%= bowerDir %>/**/*'],
            dest: 'dist'
          }
        ]
      },
      'release': {
        files: {
          'release/<%= pkg.version %>/': 'dist/**/*'
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ['example/css/{,*/}*.less']
        },
        files: {
          'example/css/main.css': 'example/css/main.less'
        }
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['widget/{,*/}*.js'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['example/css/{,*/}*.less'],
        tasks: ['less']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'example/{,*/}*.html',
          'widget/{,*/}*.html',
          'example/css/{,*/}*.css',
          'img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // The actual grunt server settings
    connect: {
      options: {
        port: 8010,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: {
            target: 'http://localhost:8010/example/'
          },
          base: [
            './'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            'test',
            './'
          ]
        }
      },
      dist: {
        options: {
          base: 'dist/'
        }
      }
    },
    'requirejs-transformconfig': {
      options: {
        // Some transformation goes here.
        transform: function (config) {
          // Remove all packages;
          delete config.packages;
          return config;
        }
      },
      dist: {
        files: [
          {
            'dist/main.js': 'main.js'
          }
        ]
      }
    },
    requirejs: {
      dist: {
        options: {
          baseUrl: 'dist',
          mainConfigFile: './example/main.js',
          include: includeSource(['widget/**/*.js']),
          paths: {
            // The config module is from the production html page.
            'jquery': 'empty:',
            'lodash': 'empty:'
          },
          exclude: [ 'template', 'text', 'lodash', 'poly'],
          optimize: 'none'
        }
      }
    },
    uglify: {
      dist: {
        src: ['dist/main.js'],
        dest: 'dist/main.min.js'
      }
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '/img',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: 'dist/img'
          }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      'release': [
        'less',
        'imagemin'
      ],
      dist: [
        'less',
        'imagemin'
      ]
    }
  });
};
