// TODO - get these from somewhere
var cardManifests = {
  'card1_id': {'assets': {'card1.css': 'http://full-path-to/card1-fingerprint.css'}}
};

// Lookup a url in the manifest for this card
var cardManifestUrl = function(cardId, url) {
  var manifest = cardManifests[cardId];
  if (manifest && manifest.assets && manifest.assets[url]) {
    return manifest.assets[url];
  }
};

// Lookup a url in the manifest available to all cards
var glazierUrl = function(url) {
  var tranlatedUrl = Glazier.manifest[url];
  if (tranlatedUrl) return Glazier.assetHost + tranlatedUrl;
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
        console.log("ManifestXHRService get " + url + " -> " + processedUrl);
      }

      var xhrServiceGet = Conductor.XHRService.prototype.requests.get;
      return xhrServiceGet.apply(this, [promise, processedUrl]);
    }
  }
});

export = ManifestXHRService;
