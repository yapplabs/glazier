var PROJECT_NAME = 'Glazier';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      main: {
        options: {
          base: 'tmp/public'
        }
      }
    },

    watch: {
      files: ['glazier/**', 'tests/**'],
      tasks: ['build', 'qunit:all']
    },

    transpile: {
      main: {
        type: "amd",
        files: [{
          expand: true,
          cwd: 'glazier',
          src: ['**/*.js'],
          dest: 'tmp/public/glazier'
        }]
      },

      tests: {
        type: "amd",
        files: [{
          expand: true,
          cwd: 'tests',
          src: ['**/*.js'],
          dest: 'tmp/public/tests/'
        }]
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['**'],
            dest: 'tmp/public/'
          }
        ]
      },

      test: {
        files: [
          {
            expand: true,
            cwd: 'tests/',
            src: ['index.html'],
            dest: 'tmp/public/tests'
        }
      ]},

      vendor: {
        files: [
          {
            expand: true,
            cwd: 'vendor',
            src: ['**'],
            dest: 'tmp/public/vendor'
          }
        ]
      }
    },

    qunit: {
      all:  {
        options: {
          urls: ['http://localhost:8000/tests/index.html']
        }
      }
    },

    ember_handlebars: {
      compile: {
        options: {
          processName: function(filename) {
            return filename.replace(/templates\//,'').replace(/\.handlebars$/,'');
          }
        },
        files: {
          "tmp/public/glazier/templates.js": "templates/*.handlebars"
        }
      }
    },

    concat: {
      main: {
        src: ['tmp/public/glazier/**/*.js'],
        dest: 'tmp/public/glazier.js'
      },
      tests: {
        src: ['tmp/public/tests/**/*.js'],
        dest: 'tmp/public/tests.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-ember-handlebars');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['ember_handlebars', 'transpile', 'copy', 'concat']);

  grunt.registerTask('test', ['build',  'connect:main', 'qunit:all']);

  grunt.registerTask('default', ['build',  'connect:main', 'watch']);
};
