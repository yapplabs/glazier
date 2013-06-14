module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  function config(configFileName) {
    return require('./configurations/' + configFileName);
  }

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
      main: {
        files: [
          {
            expand: true,
            src: ['app/**', 'css/**', '!**/*.js'],
            dest: 'tmp'
          }
        ]
      },
      manifest: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'tmp/',
          src: ['manifest.json', 'md5/*.js', 'md5/*.css'],
          dest: 'dist/',
          filter: 'isFile'
        }]
      }
    },
    concat: {
      js: {
        src: ['tmp/**/*.js'],
        dest: 'tmp/dist/github-repositories.js',
        options: {
          footer: "requireModule('card');"
        }
      },
      css: {
        src: ['tmp/css/style.css'],
        dest: 'tmp/dist/github-repositories.css'
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
    },
    s3: config('s3'),
    md5: config('md5')
  });

  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'jshint', 'copy:main', 'concat']);
  grunt.registerTask('manifest', ['build', 'md5', 'copy:manifest']);
  grunt.registerTask('deploy', ['manifest', 's3']);

  grunt.registerTask('default', ['build']);
};
