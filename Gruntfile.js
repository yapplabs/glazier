var PROJECT_NAME = 'Glazier';
var proxy = require('proxy-middleware');
var url= require('url');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          base: 'tmp/public',
          middleware: function(connect, options) {
            var theUrl, theProxy, middleware;

            theUrl = url.parse('http://localhost:3040/api');
            theUrl.route = '/api';

            theProxy = proxy(theUrl);

            middleware = [
              theProxy,
              connect['static'](options.base),
              connect.directory(options.base)
            ];

            return middleware;
          }
        }
      }
    },

    watch: {
      files: ['app/**', 'tests/**'],
      tasks: ['build', 'qunit:all']
    },

    transpile: {
      main: {
        type: "amd",
        moduleName: function(defaultModuleName){
          return 'glazier/' + defaultModuleName;
        },
        files: [{
          expand: true,
          cwd: 'app/',
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

    shell: {
      ingest: {
        command: [
          "cd glazier-server",
          "bundle exec rake glazier:ingest_as_current[../tmp/public/index.html]"
        ].join(' && '),
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
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
    },

    md5: {
      compile: {
        files: [{
          expand: true,
          cwd: 'tmp/public',
          src: ['**/*.js'],
          dest: 'tmp/md5/'
        }],
        options: {
          cmd: 'tmp/public/glazier',
          encoding: null,
          keepBasename: true,
          keepExtension: true,
          after: function (fileChanges, options) {
            var fs, manifest, key, file, from, to;

            fs = require('fs');
            manifest = {};

            for (key in fileChanges) {
              file = fileChanges[key];

              from = file.oldPath.replace(/^tmp\/public\//,'');
              to = file.newPath.replace(/^tmp\/md5\//,'');

              manifest[from] = to;
            }

            fs.writeFileSync('tmp/manifest.json', JSON.stringify({ files: manifest }));
          }
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
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-md5');

  grunt.registerTask('build', ['ember_handlebars', 'transpile', 'copy', 'concat', 'jshint']);

  grunt.registerTask('test', ['build',  'connect', 'qunit:all']);

  grunt.registerTask('default', ['build',  'connect', 'watch']);

  grunt.registerTask('ingest', ['build', 'shell:ingest']);
};
