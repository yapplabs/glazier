module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  function config(configFileName) {
    return require('./configurations/' + configFileName);
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    s3: config('s3'),
    md5: config('md5'),
    copy: config('copy'),
    clean: ["tmp", "dist"],
    concat: config('concat'),
    jshint: config('jshint'),
    transpile: config('transpile'),
    ember_handlebars: config('ember_handlebars')
  });

  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'jshint', 'copy:main', 'concat']);
  grunt.registerTask('manifest', ['build', 'md5', 'copy:manifest']);
  grunt.registerTask('deploy', ['manifest', 's3']);

  grunt.registerTask('default', ['build']);
};
