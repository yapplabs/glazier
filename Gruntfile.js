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
      files: ['glazier/**'],
      tasks: ['ember_handlebars', 'transpile', 'copy', 'concat']
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
      }
    },

    copy: {
      public: {
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['**'],
            dest: 'tmp/public/'
          }
        ]
      },

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
      options: {
        separator: ';'
      },
      dist: {
        src: ['tmp/public/glazier/**/*.js'],
        dest: 'tmp/public/glazier.js'
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

  grunt.registerTask('default', ['connect:main', 'ember_handlebars', 'transpile', 'copy', 'concat', 'watch']);
};
