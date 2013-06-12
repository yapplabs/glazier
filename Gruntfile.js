module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
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

  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'jshint', 'copy_glazier', 'sass', 'concat', 'shell:buildCards', 'copy:cards']);
  grunt.registerTask('copy_glazier', ['copy:main', 'copy:test', 'copy:fixtures', 'copy:vendor']);

  grunt.registerTask('assets', ['build', 'uglify:all', 'md5', 'index.html']);

  grunt.registerTask('ingest', ['assets', 'shell:ingest']);
  grunt.registerTask('deploy', ['assets', 's3:dev']);

  grunt.registerTask('preview', ['build', 'uglify:all', 'md5', 'index.html', 'shell:ingest', 'connect', 'watch']);
  grunt.registerTask('preview:cdn', ['prod', 'deploy', 'shell:ingest', 'connect', 'watch']);

  grunt.registerTask('test', ['shell:npmInstallForCards', 'build',  'connect', 'qunit:all']);
  grunt.registerTask('default', ['shell:npmInstallForCards','build', 'index.html', 'connect', 'watch']);
};
