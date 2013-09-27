define("ziniki",
  [/*atmosphere*/], function() {

	"use strict";
    
	var Ziniki = {};

  var url = null;
  var wsUrl = null;
  var webSocket = null;
  var token = null;
  var performingLogin = false;
  var onSuccessfulLogin = [];

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
  	this.conn = null;
  	this.delayed = [];
  	this.pending = {};
  	this.requestNo = 1;
  	
		this.send = function(packet, obj, handler) {
			var json = JSON.stringify(packet);
			console.log("Sending request " + this.requestNo +":", json);
			var payload = this.requestNo + json;
			if (this.conn)
				this.conn.push(payload);
			else
				this.delayed.push(payload);
			this.pending[this.requestNo] = new PendingDispatch(obj, handler);
			this.requestNo++;
		};

		/** Do the work to create a websocket: initialize atmosphere,
		 * pass a request, and handle the "open" message
		 */
		this.create = function(obj, onReady) {
			var self = this;
			
			// create the request to open up the connection
			var open = {
					url: wsUrl,
					transport: 'websocket',
					fallbackTransport: 'long-polling',
					
					// handle the "open" message
					onOpen: function(response) {
						self.conn.push(JSON.stringify({"X-Ziniki-Token": token, "Protocol": "emberREST"}));
					},
					
					// and then handle each incoming message
					onMessage: function(response) {
						var body = response.responseBody;
						if (body == "Confirm") {
							if (onReady) {
								if (!obj)
									onReady(self);
								else
									onReady.apply(obj, [self]);
							}
							for (var i=0;i<self.delayed.length;i++)
								self.conn.push(self.delayed[i]);
						}
						else
							self.dispatch(body);
					}
			};
			this.conn = jQuery.atmosphere.subscribe(open);
		};
		
		this.dispatch = function(body) {
			// This should be in Ziniki
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
   * 
   */
	function init(inUrl, inWsUrl) {
		url = inUrl;
		wsUrl = inWsUrl;
	};
	
	/** Get the dedicated websocket connection for adapter functionality and
	 * real-time notifications, creating it if necessary
	 */
	function getWebSocket(obj, onReady) {
		if (webSocket)
			return webSocket;
		if (!wsUrl)
			throw "Cannot open websocket without a websocket URL";

		// We can't set up the websocket without a login token, but if that process
		// is already under way, don't complain, just wait for the response
		if (token == null && !performingLogin)
				throw "Cannot open websocket until logged in";
		
		// OK, create the websocket object
		webSocket = new WebSocket();
		if (token != null)
			webSocket.create(obj, onReady);
		else
			onSuccessfulLogin.push(function() { webSocket.create(obj, onReady); });
		return webSocket;
	}
	
	function zinikiGet(url, success, failure) {
		jQuery.ajax({
			type: "GET",
			url: url,
			headers: {
				"Accept": "application/json",
				"X-Ziniki-Token": token
			},
			success: function(json, status, xhr) {
				if (success != null)
				  success(json, xhr);
			},
			error: function(xhr, text, error) {
				if (failure != null)
					failure(error, xhr);
			}
		});
	};

	function zinikiPost(url, payload, success, failure) {
		var options = {
			type: "POST",
			headers: {
				"Accept": "application/json"
			},
			success: function(json, status, xhr) {
				if (success != null)
				  success(json, xhr);
			},
			error: function(xhr, text, error) {
				console.log("Saw error ", text, error);
				if (failure != null)
					failure(xhr);
			}
		};
		if (token != null) {
			options.headers["X-Ziniki-Token"] = token;
		}
		if (payload != null) {
			options.data = JSON.stringify(payload);
			options.dataType = 'json';
			options.contentType = 'application/json';
		}
		jQuery.ajax(url, options);
	};
	
	function login(method, username, options, success, failure) {
	    performingLogin = true;
	    
	    var ret = Ember.RSVP.defer();
			if (method == "openid") {
			  	zinikiGet(url+'/login?method=openid&provider='+options.provider, handleSuccess, function() { performingLogin = false; if (failure) failure(arguments); });
			} else {
				  var hash = $.extend({"method":method,"login":username}, options);
				  var loginPacket = {"ZinikiCredential":hash};
				  zinikiPost(url+'/login', loginPacket, handleSuccess, failure);
			}
			
			return ret.promise;
	    
			// On success, we want to come back here and let everybody know the good news.
			// This includes people who were waiting while we were doing the round trip
		  function handleSuccess(json, xhr) {
		      performingLogin = false;
			    token = xhr.getResponseHeader("X-Ziniki-Token");
				  ret.resolve();
			    if (success)
				      success(json);
			    for (var i=0;i<onSuccessfulLogin.length;i++)
				      onSuccessfulLogin[i]();
			    onSuccessfulLogin = [];
		  }

	};
	
	function logout() {
		zinikiPost(url+"/logout", null, null, null);
	}

	// If you already have a token, you can call this
	function reuseToken(inToken) {
		token = inToken;
	};

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
	
	function zinikiGetResource(app, prot, resource, id, success, failure) {
		var rest = assembleUrl(app, prot, resource, id);
		zinikiGet(rest, success, failure);
	}

	function zinikiSave(app, prot, resource, id, data, success, failure) {
		var rest = assembleUrl(app, prot, resource, id);
		zinikiPost(rest, data, success, failure);
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
			logout: logout,
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