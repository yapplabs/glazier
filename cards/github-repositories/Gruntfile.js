module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var _ = require('underscore'),
    sharedConfig = require('glazier-card-grunt-config').config;

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env
  };

  config = _.extend(config, sharedConfig);
  grunt.initConfig(config);

  grunt.registerTask('build', ['clean', 'ember_handlebars', 'transpile', 'jshint', 'copy:main', 'concat']);
  grunt.registerTask('manifest', ['build', 'md5', 'copy:manifest']);
  grunt.registerTask('deploy', ['manifest', 's3']);

  grunt.registerTask('default', ['build']);
};
