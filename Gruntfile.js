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
    },
    jshint: {
      all: {
        // TODO: Run jshint on individual files when jshint supports ES6 modules
        src: ['Gruntfile.js', 'tmp/public/glazier.js', 'tmp/public/tests.js'],
        options: {
          predef: [
            "Ember",
            "define",
            "console",
            "require",
            "requireModule",
            "equal",
            "notEqual",
            "notStrictEqual",
            "test",
            "asyncTest",
            "testBoth",
            "testWithDefault",
            "raises",
            "throws",
            "deepEqual",
            "start",
            "stop",
            "ok",
            "strictEqual",
            "module",
            "expect"
          ],
          "node" : false,
          "browser" : true,
          "boss" : true,
          "curly": false,
          "debug": false,
          "devel": false,
          "eqeqeq": true,
          "evil": true,
          "forin": false,
          "immed": false,
          "laxbreak": false,
          "newcap": true,
          "noarg": true,
          "noempty": false,
          "nonew": false,
          "nomen": false,
          "onevar": false,
          "plusplus": false,
          "regexp": false,
          "undef": true,
          "sub": true,
          "strict": false,
          "white": false,
          "eqnull": true
        }
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
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('build', ['ember_handlebars', 'transpile', 'copy', 'concat', 'jshint']);

  grunt.registerTask('test', ['build',  'connect:main', 'qunit:all']);

  grunt.registerTask('default', ['build',  'connect:main', 'watch']);
};
