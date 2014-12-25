'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        globalstrict: true,
        node: true,
        loopfunc: true,
        browser: true,
        globals: {
          angular: true,
          describe: true,
          it: true,
          expect: true,
          jasmine: true,
          beforeEach: true,
          afterEach: true,
          inject: true,
          spyOn: true
        }
      },
      test: {
        options: {
          force: false,
          ignores: ['**.min.js']
        },
        files: {
          src: [
            'templateloader.js',
            'test/*.js'
          ]
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      build: {
        files: {
          'templateloader.min.js': ['templateloader.js']
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {},
        src: 'templateloader.min.js',
        dest: 'templateloader.min.js'
      }
    }
  });


  grunt.registerTask('default', [
    'jshint',
    'karma',
    'ngAnnotate',
    'uglify'
  ]);
};
