module.exports = function(grunt){
  grunt.registerTask('lock', 'Set semaphore for connect server to wait on.', function() {
    grunt.isLockedDuringBuild = true;
  });

  grunt.registerTask('unlock', 'Release semaphore that connect server waits on.', function() {
    grunt.isLockedDuringBuild = false;
  });
};
