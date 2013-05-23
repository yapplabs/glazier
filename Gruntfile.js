var PROJECT_NAME = 'Glazier';
var proxy = require('proxy-middleware');
var url= require('url');
var CLOUDFRONT_HOST = "http://d4h95iioxf8ji.cloudfront.net";

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
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

    s3: {
      options: {
        key: '<%= env.GLAZIER_S3_KEY %>',
        secret: '<%= env.GLAZIER_S3_SECRET %>',
        bucket: 'glazier',
        gzip: true,
        access: 'public-read'
      },
      dev: {
        upload: [
          {
            src: 'tmp/md5/glazier*.js',
            dest: 'assets/'
          },
          {
            src: 'tmp/md5/vendor/**/*-*.js',
            dest: 'assets/vendor/'
          }
        ]
      }
    },

    jshint: {
      all: {
        // TODO: Run jshint on individual files when jshint supports ES6 modules
        src: ['Gruntfile.js', 'tmp/public/glazier.js', 'tmp/public/tests.js'],
        options: {
          predef: [
            "Ember",
            "Conductor",
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
            "process",
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

    clean: ["tmp"],

    md5: {
      compile: {
        files: [{
          expand: true,
          cwd: 'tmp/public',
          src: ['**/*.*'],
          dest: 'tmp/md5/'
        }],
        options: {
          cmd: 'tmp/public/glazier',
          encoding: null,
          keepBasename: true,
          keepExtension: true,
          after: function (fileChanges, options) {
            var manifest, key, file, from, to;

            manifest = {};

            for (key in fileChanges) {
              file = fileChanges[key];

              from = file.oldPath.replace(/^tmp\/public/,'');
              to = file.newPath.replace(/^tmp\/md5/,'/assets');

              manifest[from] = to;
            }

            grunt.file.write('tmp/manifest.json', JSON.stringify(manifest));
          }
        }
      }
    },

    uglify: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'tmp/public/',
            src: ['glazier.js'],
            ext: '.min.js',
            dest: 'tmp/public/'
          },
          {
            expand: true,
            cwd: 'tmp/public/vendor/',
            src: '**/*.js',
            ext: '.min.js',
            dest: 'tmp/public/vendor/'
          }
        ]
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
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('index.html', 'process index.html', function() {
    var template = grunt.file.read('public/index.html');
    var manifestContents = grunt.file.read('tmp/manifest.json');
    var manifest = JSON.parse(manifestContents);
    var indexContents = grunt.template.process(template, {
      data: {
        manifestUrl: function(path) {
          if (process.env.GLAZIER_ENV === "prod") {
            path = path.replace(/\.js$/, '.min.js');
            /* Our MD5 task adds the -MD5 directly before the .js */
            return CLOUDFRONT_HOST + manifest[path]; //.replace(/(-[^-]+)\.js$/, '$1.js');
          }
          return path;
        }
      }
    });

    grunt.file.write("tmp/public/index.html", indexContents);
  });


  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'copy', 'concat', 'jshint']);

  grunt.registerTask('test', ['build',  'connect', 'qunit:all']);

  grunt.registerTask('default', ['assets', 'connect', 'watch', 'index.html']);

  grunt.registerTask('assets', ['build', 'uglify:all', 'md5', 'index.html']);

  grunt.registerTask('ingest', ['assets', 'shell:ingest']);

  grunt.registerTask('deploy', ['assets', 's3:dev']);

  grunt.registerTask('preview', ['deploy', 'shell:ingest', 'connect', 'watch']);
};
