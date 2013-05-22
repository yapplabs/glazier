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
      files: ['app/**'],
      tasks: ['ember_handlebars', 'transpile', 'copy']
    },

    transpile: {
      main: {
        type: "amd",
        moduleName: PROJECT_NAME.toLowerCase(),
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['**/*.js'],
          dest: 'tmp/public/app'
        }]
      }
    },

    copy: {
      index: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['index.html'],
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
            return filename.replace(/^app\/templates\//,'').replace(/\.handlebars$/,'');
          }
        },
        files: {
          "tmp/public/app/templates.js": "app/templates/*.handlebars"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ember-handlebars');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');

  grunt.registerTask('default', ['connect:main', 'ember_handlebars', 'transpile', 'copy', 'watch']);
};
