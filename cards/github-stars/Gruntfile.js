module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    clean: ["tmp", "dist"],
    ember_handlebars: {
      compile: {
        options: {
          processName: function(filename) {
            return filename.replace(/templates\//,'').replace(/\.handlebars$/,'');
          }
        },
        files: {
          "tmp/templates.js": "templates/*.handlebars"
        }
      }
    },
    transpile: {
      code: {
        type: "amd",
        files: [{
          expand: true,
          src: ['app/**/*.js', 'card.js'],
          dest: 'tmp/'
        }]
      },

      templates: {
        type: "amd",
        files: [{
          expand: true,
          cwd: 'tmp/',
          src: ['**/templates.js'],
          dest: 'tmp/'
        }]
      }
    },
    copy: {
      all: {
        files: [
          {
            expand: true,
            src: ['app/**', 'css/**', '!**/*.js'],
            dest: 'tmp'
          }
        ]
      }
    },
    concat: {
      js: {
        src: ['tmp/**/*.js'],
        dest: 'dist/github-stars.js',
        options: {
          footer: "requireModule('card');"
        }
      },
      css: {
        src: ['tmp/css/style.css'],
        dest: 'dist/github-stars.css'
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

  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'jshint', 'copy', 'concat']);
  grunt.registerTask('default', ['build']);
};
