var proxy = require('proxy-middleware');
var connectLiveReload = require('connect-livereload');
var url = require('url');
var request = require('http').request;
var lockFile = require('lockfile');

module.exports = {
  server: {
    options: {
      port: process.env.port || 8000,
      hostname: '0.0.0.0',
      base: 'tmp/public',
      middleware: middleware
    }
  }
};

function proxyIndex(req, res, next){
  if (shouldProxyIndex(req.url)) {
    // TODO: don't hardcode configuration

    var theUrl = url.parse(req.url)
    theUrl.headers = {};
    theUrl.headers['Host'] = 'localhost:8000';
    theUrl.hostname = '0.0.0.0';
    theUrl.port = '3040';

    var proxyReq =  request(theUrl, function (proxyRes) {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.on('error', next);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', next);

    if (!req.readable) {
      proxyReq.end();
    } else {
      req.pipe(proxyReq);
    }

  } else {
    next();
  }
}

// works with tasks/locking.js
function lock(req, res, next) {
  var lockPath = '';

  (function retry() {
    if (lockFile.checkSync(lockPath + 'tmp/connect.lock')) {
      setTimeout(retry, 100);
    } else {
      next();
    }
  }());
}

function middleware(connect, options) {
  var theUrl;

  theUrl = url.parse('http://localhost:3040/api');
  theUrl.route = '/api';

  return [
    connectLiveReload(),
    lock,
    proxy(theUrl),
    proxyIndex,
    connect['static'](options.base),
    connect.directory(options.base)
  ];
}

var reservedRoutes = /^\/(vendor|css|js|cards|api|test)\//;
var githubRepo = /^\/[^\/]+\/[^\/]+$/;

function shouldProxyIndex(url) {
  return url === "/" || url === "/index.html" ||
    (!reservedRoutes.test(url) && githubRepo.test(url));
}
