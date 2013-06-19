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
        src: 'dist/prod/manifest.json',
        dest: cardDest + '/manifest.json'
      },
      {
        src: 'dist/prod/*-*.*',
        dest: cardDest + '/assets/'
      }
    ]
  }
};

