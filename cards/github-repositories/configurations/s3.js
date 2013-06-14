var cardDest = 'assets/cards/<%= pkg.repositoryName %>';

module.exports = {
  options: {
    key: '<%= env.GLAZIER_S3_KEY %>',
    secret: '<%= env.GLAZIER_S3_SECRET %>',
    bucket: 'glazier',
    gzip: true,
    access: 'public-read'
  },
  main: {
    upload: [
      {
        src: 'tmp/manifest.json',
        dest: cardDest
      },
      {
        src: 'tmp/md5/cards/**/*-*.js',
        dest: cardDest + '/assets'
      },
      {
        src: 'tmp/md5/cards/**/*-*.css',
        dest: cardDest + '/assets'
      }
    ]
  }
};

