define("ziniki",
    [/*atmosphere*/], function() {

  "use strict";

/* Interface to Ziniki from JavaScript
 * (C) 2013 Ziniki Infrastructure Software, LLC
 * Author: Gareth Powell
 */
  var Ziniki = {};
function getURLParameterByName(window, name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if (results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}

  var url = null;
  var wsUrl = null;
  var webSocket = null;
  var performingLogin = false;

  function setLoggedInUser(newValue)
  {
          sessionStorage.setItem("userName", newValue.name);
          sessionStorage.setItem("userToken", newValue.token);
  }

  function clearLoggedInUser()
  {
          sessionStorage.removeItem("userName");
          sessionStorage.removeItem("userToken");
  }

  function getLoggedInUser()
  {
          var name = sessionStorage.getItem("userName");
          var token = sessionStorage.getItem("userToken");
          return token ? new LoggedInUser(name, token) : null;
  }

  function getLoggedInUserName()
  {
          return getLoggedInUser().name;
  }
  
  function getToken()
  {
          var user = getLoggedInUser();
          return user ? user.token : null;
  }

  function hasToken()
  {
          return getToken() != null;
  }

    // If you already have a token, you can call this
    function reuseToken(inToken) {
          setLoggedInUser(new LoggedInUser(inToken, inToken));
    };

  /** We need to keep track of all server requests by id
   * and then map those ids back to the requests so that
   * we can handle the reponses
   */
  function PendingDispatch(obj, handler) {

    this.dispatch = function(json) {
      if (obj != null)
        handler.apply(obj, [json]);
      else
        handler(json);
    }

    this.handleError = function(json) {
      console.log("We should use promises");
      console.log("Error reported from Ziniki:", json);
    }
  }

  /** This object is responsible for wrapping up the Atmosphere web socket in something
   * that we can use more broadly and add our own interfaces on.
   */
  function WebSocket() {
    this._conn = null;
    this.delayed = [];
    this.pending = {};
    this.requestNo = 1;

    this.send = function(packet, obj, handler) {
      var json = JSON.stringify(packet);
      console.log("Sending request " + this.requestNo +":", json);
      var payload = this.requestNo + json;
      this.conn().then(function(conn) {
        conn.push(payload);
      });
      this.pending[this.requestNo] = new PendingDispatch(obj, handler);
      this.requestNo++;
    };

    this.conn = function() {
      if (!this._conn)
        this._conn = this.create();
      return this._conn;
    }

    /** Do the work to create a websocket: initialize atmosphere,
     * pass a request, and handle the "open" message
     */
    this.create = function() {
      var token = getToken();
      if (token == null && !performingLogin)
        throw "Cannot open websocket until logged in";
      var self = this;
      var actualConn;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        // create the request to open up the connection
        var open = {
            url: wsUrl,
            transport: 'websocket',
            fallbackTransport: 'long-polling',

            // handle the "open" message
            onOpen: function(response) {
              actualConn.push(JSON.stringify({"X-Ziniki-Token": token, "Protocol": "emberREST"}));
            },

            // and then handle each incoming message
            onMessage: function(response) {
              var body = response.responseBody;
              if (body == "Confirm")
                resolve(actualConn);
              else
                self.dispatch(body);
            }
        };
        actualConn = jQuery.atmosphere.subscribe(open);
      });
    };

    this.dispatch = function(body) {
      var isError = false;
      var idx = body.indexOf('[');
      if (idx == -1) {
        idx = body.indexOf('{');
        if (idx == -1)
          throw "Cannot interpret body " + body;
        isError = true;
      }
      var rn = body.substring(0, idx);
      var req = this.pending[rn];
      var json = body.substring(idx);
      console.log("Received response " + rn + ": ", json);
      var msg = JSON.parse(json);
      if (isError)
        req.handleError(msg);
      else
        req.dispatch(msg);
    };
  };

  /** Tell us how to find Ziniki
   */
  function init(inUrl, inWsUrl) {
    url = inUrl;
    wsUrl = inWsUrl;
  };

  /** Get the dedicated websocket connection for adapter functionality and
   * real-time notifications, creating it if necessary
   */
  function getWebSocket() {
    if (webSocket)
      return webSocket;
    if (!wsUrl)
      throw "Cannot open websocket without a websocket URL";

    // We can't set up the websocket without a login token, but if that process
    // is already under way, don't complain, just wait for the response
    if (getToken() == null && !performingLogin)
      throw "Cannot open websocket until logged in";

    // OK, create the websocket object
    return new WebSocket();
  }

	function Response(xhr, json, textStatus)
	{
		this.xhr = xhr;
		this.json = json;
		this.status = status;
	}
	
	function RequestError(xhr, textStatus, errorThrown)
	{
		this.name = "RequestError";
		this.xhr = xhr;
		this.textStatus = textStatus;
		this.errorThrown = errorThrown;
	}
	RequestError.prototype = new Error("An error occurred while a request was being processed.");
	
	function zinikiGet(url)
	{
		return new Ember.RSVP.Promise(function(resolve, reject)
			{
				jQuery.ajax({
					type: "GET",
					url: url,
					headers: {
						"Accept": "application/json",
						"X-Ziniki-Token": getToken()
					},
					success: function(json, textStatus, xhr) {	resolve(new Response(xhr, json, textStatus));	},
					error: function(xhr, textStatus, errorThrown) {	reject(new RequestError(xhr, textStatus, errorThrown));	}
				});
			});
  };

	function zinikiPost(url, payload)
	{
		return new Ember.RSVP.Promise(function(resolve, reject)
			{
				var options =
				{
					type: "POST",
					headers: {"Accept": "application/json"},
					success: function(json, textStatus, xhr) {	resolve(new Response(xhr, json, textStatus));	},
					error: function(xhr, textStatus, errorThrown) {	reject(new RequestError(xhr, textStatus, errorThrown));	}
				};
				
				if (getToken() != null)
					options.headers["X-Ziniki-Token"] = getToken();
				
				if (payload != null)
				{
					options.data = JSON.stringify(payload);
					options.dataType = 'json';
					options.contentType = 'application/json';
				}
				
				jQuery.ajax(url, options);
			});
  };

  function LoggedInUser(name, token)
  {
          this.name = name;
          this.token = token;
  }

	function login(username, password)
	{
		var hash = {method: "basic", login: username, password: password};
		var loginPacket = {"ZinikiCredential": hash};
		var loginPromise = zinikiPost(url + "/login", loginPacket);
		
    performingLogin = true;
		return loginPromise.then(
			function(response)
			{
				var token = response.xhr.getResponseHeader("X-Ziniki-Token");
				setLoggedInUser(new LoggedInUser(username, token));
				performingLogin = false;
			});
	}
	
	function loginViaOpenID(window, providerString)
	{
	        performingLogin = true;
		return new Ember.RSVP.Promise(function(resolve, reject)
			{
				var popupURL = url + "/login?method=openid&provider=" + encodeURIComponent(providerString) + "&returnTo=" + encodeURIComponent(window.location.origin + "/loggedIn.html");
				var popup = window.open(popupURL);
				
				var intervalID = window.setInterval(function()
					{
						function cleanupAction()
						{
							window.clearInterval(intervalID);
							popup.close();
						}
						
						var loginIsComplete = false;
						
						try
						{
							loginIsComplete = popup.document && popup.document.domain === window.document.domain && popup.specialZinikiProperty4185809849535936024619905263 == 6986;
						}
						catch (error)	// the code above tries to gracefully set loginIsComplete to false while the popup is pointing to the provider's site, but
						{					// there didn't seem to be a way to detect that condition (without triggering a security-related exception) in the case
						}					// where the main window is using http and the provider is using https or vice versa...  so here that exception is quietly
											// accepted as evidence that loginIsComplete should remain false
						if (loginIsComplete)
						{
							var token = getURLParameterByName(popup, "token");
							setLoggedInUser(new LoggedInUser("OpenID", token));
							performingLogin = false;
							cleanupAction();
							resolve();
						}
						else if (popup.closed)
						{
							cleanupAction();
							reject();
						}
					}, 64);
			});
	}

	
	function logout()
	{
		clearLoggedInUser();
		return zinikiPost(url + "/logout", null);
  }

  // This creates a new credential
  function newCredential(method, username, options, success, failure) {
    var kvoptions = [];
    for (var k in options) {
      if (options.hasOwnProperty(k))
        kvoptions.push({"Option":{"key":k,"value":options[k]}});
    }
    var hash = $.extend({"method":method,"login":username}, {"options":kvoptions});
    var credPacket = {"org.ziniki.builtin.commands.CaOpArgs": hash};
    zinikiPost(url+'/org.ziniki.builtin/ca/newCredential', credPacket, success, failure);
  };

  // With a new credential, comes (potentially) a new identity.
  // Note: you must already be logged in
  function createIdentity(success, failure) {
    zinikiPost(url+'/org.ziniki.builtin/ca/createIdentity', null, success, failure);
  };

  // Authorize an application
  function authorize(app, success, failure) {
    zinikiPost(url+'/org.ziniki.builtin/ca/authorize', {"org.ziniki.builtin.commands.CaOpArgs": {"application":app}}, success, failure);
  };

  function assembleUrl(app, prot, resource, id, method) {
    var rest = url;
    if (app != null)
      rest += "/"+app;
    if (prot != null)
      rest += "/"+prot;
    if (resource != null) {
      rest += "/"+resource;
      if (id != null)
        rest += "/"+id;
    }
    if (method != null)
      rest += "/"+method;
    return rest;
  };

	function zinikiGetResource(app, prot, resource, id) {
    var rest = assembleUrl(app, prot, resource, id);
		return zinikiGet(rest);
  }

	function zinikiSave(app, prot, resource, id, data) {
    var rest = assembleUrl(app, prot, resource, id);
		return zinikiPost(rest, data);
  }

  function zinikiCall(app, prot, method, data, success, failure) {
    var rest = assembleUrl(app, prot, null, null, method);
    zinikiPost(rest, data, success, failure);
  }

  function zinikiInvoke(app, prot, resource, id, method, data, success, failure) {
    var rest = assembleUrl(app, prot, resource, id, method);
    zinikiPost(rest, data, success, failure);
  }

  Ziniki = {
      init: init,
      login: login,
	  loginViaOpenID: loginViaOpenID,
      logout: logout,
      hasToken: hasToken,
      getLoggedInUserName: getLoggedInUserName,
      reuseToken: reuseToken,
      newCredential: newCredential,
      createIdentity: createIdentity,
      authorize: authorize,
      get: zinikiGetResource,
      call: zinikiCall,
      invoke: zinikiInvoke,
      save: zinikiSave,
      getWebSocket: getWebSocket
  };

  return Ziniki;
});