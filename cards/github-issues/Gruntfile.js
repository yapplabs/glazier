module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  function config(configFileName) {
    return require('./configurations/' + configFileName);
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    copy: config('copy'),
    clean: ["tmp", "dist"],
    concat: config('concat'),
    jshint: config('jshint'),
    transpile: config('transpile'),
    ember_handlebars: config('ember_handlebars')
  });

  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'jshint', 'copy', 'concat']);
  grunt.registerTask('default', ['build']);
};
