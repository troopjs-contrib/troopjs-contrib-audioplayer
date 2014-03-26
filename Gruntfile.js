/*global module:false*/
module.exports = function (grunt) {

  var path = require('path');
  require("load-grunt-tasks")(grunt);

  grunt.registerTask("default", [
    //'jshint:source',
    'clean:dist',
    'copy:dist',
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
          paths: ['example/css/**/*.less']
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
          'widget/**/*.js',
          'example/**/*.html',
          'example/css/*.css'
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
    requirejs: {
      dist: {
        options: {
          out: 'dist/main.js',
          include: includeSource(['widget/**/*.js']),
          packages: [{
            name: 'mu-template',
            location: 'bower_components/mu-template'
          }],
          map: {
            '*' : {
              'template': 'mu-template/plugin'
            }
          },
          paths: {
            'text': 'bower_components/requirejs-text/text',
            'troopjs-audio-player': '.',
            'troopjs-core': 'empty:',
            'troopjs-browser': 'empty:',
            'mediaelement': 'empty:',
            'lodash': 'empty:',
            'jquery': 'empty:',
            'poly': 'empty:'
          },
          exclude: [ 'template', 'text'],
          optimize: 'none'
        }
      }
    },
    uglify: {
      dist: {
        src: ['dist/main.js'],
        dest: 'dist/main.min.js'
      }
    }
  });
};
