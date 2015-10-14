'use strict';

var path = require('path');

module.exports = function(grunt) {
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    express: {
      custom: {
        options: {
          port: '4000',
          hostname: '0.0.0.0',
          server: path.resolve('./build/index')
        }
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      app: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: '**',
          dest: 'build/'
        }]
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express');
 
  grunt.registerTask('serve', ['build', 'express', 'express-keepalive']);
  grunt.registerTask('build', ['copy:app']);
  grunt.registerTask('default', ['build']);
};