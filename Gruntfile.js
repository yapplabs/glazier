module.exports = function(grunt) {
  require('matchdep').
    filterDev('grunt-*').
    filter(function(name){ return name !== 'grunt-cli'; }).
      forEach(grunt.loadNpmTasks);

  grunt.loadTasks('tasks');

  function config(configFileName) {
    return require('./configurations/' + configFileName);
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,

    connect: config('connect'),
    watch: config('watch'),
    transpile: config('transpile'),
    copy: config('copy'),
    qunit: config('qunit'),
    ember_handlebars: config('ember_handlebars'),
    concat: config('concat'),
    sass: config('sass'),
    shell: config('shell'),
    s3: config('s3'),
    jshint: config('jshint'),
    clean: ["tmp"],
    md5: config('md5'),
    uglify: config('uglify')
  });

  grunt.registerTask("prod", function(){
    process.env.GLAZIER_ENV = 'prod';
  });

  grunt.registerTask("jsframe", function(){
    var fs = require('fs'),
        jsf = require('jsframe'),
        out = fs.openSync('tmp/public/vendor/conductor.js.html', 'w');

    jsf.process('tmp/public/vendor/conductor.js', out);
  });

  grunt.registerTask('build', [
                       'clean',
                       'ember_handlebars',
                       'transpile',
                       'jshint',
                       'copy_glazier',
                       'sass',
                       'concat',
                       'jsframe',
                       'shell:buildCards',
                       'copy:cards' ]);

  grunt.registerTask('copy_glazier', ['copy:main', 'copy:test', 'copy:fixtures', 'copy:vendor']);

  grunt.registerTask('assets', ['build', /*'uglify:all',*/ 'md5', 'index.html']);

  grunt.registerTask('ingest', ['assets', 'shell:ingest']);
  grunt.registerTask('deploy', ['prod', 'assets', 's3:dev']);

  grunt.registerTask('ingestCards', ['shell:npmInstallForCards', 'build', 'shell:ingestCardManifests']);
  grunt.registerTask('preview', ['build', /*'uglify:all',*/ 'md5', 'index.html', 'shell:ingest', 'connect', 'watch']);

  grunt.registerTask('server', ['shell:glazierServer']);
  grunt.registerTask('test', ['shell:npmInstallForCards', 'build',  'connect', 'qunit:all']);
  grunt.registerTask('default', ['shell:npmInstallForCards','build', 'index.html', 'connect', 'watch']);
};
