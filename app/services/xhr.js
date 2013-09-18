import Conductor from 'conductor';
import XHRService from 'conductor/xhr_service';

function protocolRelative(url){
  if (document.location.protocol === 'https:') {
    return url.replace(/^http:/, 'https:');
  } else {
    return url;
  }
}

// Lookup a url in the manifest for this card
function cardManifestUrl(cardManifest, url) {
  if (cardManifest && cardManifest.assets && cardManifest.assets[url]) {
    return protocolRelative(cardManifest.assets[url]);
  }
}

// Lookup a url in the manifest available to all cards
function glazierUrl(url) {
  if (Glazier.manifest) {
    var translatedUrl = Glazier.manifest[url];
    if (Glazier.env === 'prod') {
      var minifiedUrl = Glazier.manifest[url.replace(/\.(js|css)$/, '.min.$1')];
      if (minifiedUrl) {
        translatedUrl = minifiedUrl;
      }
    }
    if (translatedUrl) {
      return protocolRelative(Glazier.assetHost + translatedUrl);
    }
  }
  return null;
}

var ManifestXHRService = XHRService.extend({
  requests: {
    /*
      @public

      Extend Conductor's XHRService to allow checking urls against a manifest so that cards
      can map non-fingerprinted urls to fingerprinted urls.

      Also alow glazier to provide fingerprinted urls for vendored assets that it uses to cards.

      By setting `Conductor.services['xhr'] = ManifestXHRService` this will take the place of the original XHRService.

      @method get
      @param url {String}
    */
    get: function(url) {
      var processedUrl = cardManifestUrl(this.sandbox.card.manifest, url) || glazierUrl(url) || url;

      if (url !== processedUrl) {
        console.log("ManifestXHRService get", url, "->", processedUrl);
      }

      var xhrServiceGet = XHRService.prototype.requests.get;
      return xhrServiceGet.call(this, processedUrl);
    }
  }
});

export default ManifestXHRService;
