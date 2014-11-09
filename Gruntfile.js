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
          angular: true
        }
      },
      test: {
        options: {
          force: false,
          ignores: ['**.min.js']
        },
        files: {
          src: [
            'index.js',
            'test/*.js'
          ]
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: [ 'PhantomJS' ]
      }
    },

    'ng-annotate': {},

    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {},
        src: 'index.js',
        dest: 'templateloader.min.js'
      }
    }
  });


  grunt.registerTask('default', [
    'jshint',
    'karma',
    'ng-annotate',
    'uglify'
  ]);
};
