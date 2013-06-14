var cardDest = 'assets/cards/<%= pkg.glazierConfig.repositoryName %>';

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
        src: 'dist/manifest.json',
        dest: cardDest + '/manifest.json'
      },
      {
        src: 'dist/*-*.js',
        dest: cardDest + '/assets/'
      },
      {
        src: 'dist/*-*.css',
        dest: cardDest + '/assets/'
      }
    ]
  }
};

