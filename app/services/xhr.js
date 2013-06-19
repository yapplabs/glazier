import 'conductor' as Conductor;

// Lookup a url in the manifest for this card
var cardManifestUrl = function(cardId, url) {
  // assume the manifest is already loaded, this is likely brittle
  var manifest = Glazier.Pane.find(cardId).get('cardManifest.manifest');

  if (manifest && manifest.assets && manifest.assets[url]) {
    return manifest.assets[url];
  }
};

// Lookup a url in the manifest available to all cards
var glazierUrl = function(url) {
  if (Glazier.manifest) {
    var translatedUrl = Glazier.manifest[url];
    if (translatedUrl) {
      return Glazier.assetHost + translatedUrl;
    }
  }
  return null;
};

var ManifestXHRService = Conductor.XHRService.extend({
  requests: {
    /*
      @public

      Extend Conductor's XHRService to allow checking urls against a manifest so that cards
      can map non-fingerprinted urls to fingerprinted urls.

      Also alow glazier to provide fingerprinted urls for vendored assets that it uses to cards.

      By setting `Conductor.services['xhr'] = ManifestXHRService` this will take the place of the original XHRService.

      @method get
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param url {String}
    */
    get: function(promise, url) {
      var processedUrl = cardManifestUrl(this.sandbox.card.id, url) || glazierUrl(url) || url;

      if (url !== processedUrl) {
        console.log("ManifestXHRService get", url, "->", processedUrl);
      }

      var xhrServiceGet = Conductor.XHRService.prototype.requests.get;
      return xhrServiceGet.apply(this, [promise, processedUrl]);
    }
  }
});

export = ManifestXHRService;
