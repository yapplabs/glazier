module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    clean: ["tmp", "dist"],
    transpile: {
      code: {
        type: "amd",
        files: [{
          expand: true,
          src: ['card.js', 'app/**/*.js'],
          dest: 'tmp/'
        }]
      }
    },
    copy: {
      all: {
        files: [
          {
            expand: true,
            src: ['css/**', '!**/*.js'],
            dest: 'tmp'
          }
        ]
      }
    },
    concat: {
      js: {
        src: ['tmp/**/*.js'],
        dest: 'dist/github-auth.js',
        options: {
          footer: "requireModule('card');"
        }
      },
      css: {
        src: ['tmp/css/style.css'],
        dest: 'dist/github-auth.css'
      }
    },
    jshint: {
      all: {
        src: ['Gruntfile.js', 'tmp/**/*.js'],
        options: {
          jshintrc: '.jshintrc',
          force: true
        }
      }
    }
  });

  grunt.registerTask('build', ['clean', 'transpile', 'jshint', 'copy', 'concat']);
  grunt.registerTask('default', ['build']);
};
