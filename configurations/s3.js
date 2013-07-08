module.exports = {
  options: {
    key: '<%= env.GLAZIER_S3_KEY %>',
    secret: '<%= env.GLAZIER_S3_SECRET %>',
    bucket: 'glazier',
    gzip: true,
    access: 'public-read'
  },
  prod: {
    upload: [
      {
        src: 'tmp/md5/*-*.*',
        dest: 'assets/'
      },
      {
        src: 'tmp/md5/css/**/*-*.css',
        dest: 'assets/css'
      },
      {
        src: 'tmp/md5/vendor/**/*',
        dest: 'assets/vendor/'
      },
      {
        src: 'tmp/md5/cards/**/*-*.js',
        dest: 'assets/cards/'
      },
      {
        src: 'tmp/md5/cards/**/*-*.css',
        dest: 'assets/cards/'
      }
    ]
  }
};
