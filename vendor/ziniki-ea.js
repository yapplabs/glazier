define("ziniki/ea",
  ["ziniki", "ziniki/sr"], function (Ziniki, ZinikiSerializer) {
	
   "use strict";
   
	/** When issuing requests to the server, we need to keep a record of
	 * what we expected them to do and any other contextual information so
	 * that we can handle the response.
	 * 
	 * We issue requests in a batch and expect to get a response which is the
	 * same "shape" (i.e. an array with the same number of entries and compatible
	 * with the answers).
	 */
	function Batch(webSocket) {
		this.requests = [];
		this.payload = [];

		/** Add a request to the batch.  Append the actual request object
		 * to requests, and its serialization into payload
		 * 
		 * request - any suitable request object (Find, FindAll, Create, etc)
		 */
		this.add = function(request) {
			this.requests.push(request);
			this.payload.push(request.serialize());
		}

		/** When the batch is ready, send it across to the server
		 */
		this.send = function() {
			webSocket.send(this.payload, this, this.respond);
		}

		/** Handle the incoming batch response by processing each of the request elements in turn
		 * and calling the original request with the slice of response.
		 * 
		 * json - the JSON object which comprises the response
		 */
		this.respond = function(json) {
			if (json.length != this.requests.length)
				throw "The response had a different number of entries to the request (" + json.length + "!=" + this.requests.length + ")";
			for (var i=0;i<this.requests.length;i++) {
				this.requests[i].handleActionResponse(json[i]);
			}
		}
	}

	/** A request for "Find"
	 */
	function Find(store, adapter, type, id, resolve, reject) {
		var serializer = adapter.get('serializer');
		var mapping = serializer.typeMapping(type);
		var typeName = mapping.zinikiGenericName;

		/** Serialize the request */
		this.serialize = function() {
			if (mapping && mapping.findByKey)
				return {action:"findByKey",type:typeName,key:mapping.findByKey,values:[id]};
		  else
			  return {action:"find",type:typeName,findId:id};
		}
		
		/** Handle the response when it comes back
		 */
		this.handleActionResponse = function(resp) {
			var ret = null;
			for (var p in resp) {
				if (resp.hasOwnProperty(p)) {
					if (p == typeName) {
						var mapped = serializer.mapArray(type, resp[p]);
						ret = mapped[0];
					}
					else {
						var m = serializer.fromZinikiType(p);
						for (var idx in serializer.mapArray(m.type, resp[p])) {
							var q = resp[p][idx];
							store.push(m.emberKey, q);
						}
					}
				}
			}
			resolve(ret);
		}
	}
	
	/** A request for "FindAll"
	 */
	function FindAll(store, adapter, type, resolve, reject) {
		var serializer = adapter.get('serializer');
		var mapping = serializer.typeMapping(type);
		var typeName = mapping.zinikiGenericName;

		/** Serialize the request */
		this.serialize = function() {
			return {action:"findAll",type:typeName};
		}
		
		/** Handle the response when it comes back
		 */
		this.handleActionResponse = function(resp) {
			var ret = null;
			for (var p in resp) {
				if (resp.hasOwnProperty(p)) {
					if (p == typeName)
						ret = serializer.mapArray(type, resp[p]);
					else {
						var m = serializer.fromZinikiType(p);
						for (var idx in resp[p]) {
							var q = resp[p][idx];
							store.push(m.emberKey, q);
						}
					}
				}
			}
			resolve(ret);
		}
	}

	/** A request for "FindMany"
	 */
	function FindMany(store, adapter, type, ids, resolve, reject) {
		var serializer = adapter.get('serializer');
		var mapping = serializer.typeMapping(type);
		var typeName = mapping.zinikiGenericName;

		/** Serialize the request */
		this.serialize = function() {
			if (mapping && mapping.findByKey) {
				var many = [];
				for (var i=0;i<ids.length;i++) {
					many.push([ids[i]]);
				}
				return {action:"findManyByKey",type:typeName,key:mapping.findByKey,values:many};
			} else
			  return {action:"findMany",type:typeName,findIds:ids};
		}
		
		/** Handle the response when it comes back
		 */
		this.handleActionResponse = function(resp) {
			var ret = null;
			for (var p in resp) {
				if (resp.hasOwnProperty(p)) {
					if (p == typeName)
						ret = serializer.mapArray(type, resp[p]);
					else {
						var m = serializer.fromZinikiType(p);
						for (var idx in resp[p]) {
							var q = serializer.mapArray(m.type, resp[p][idx]);
							store.push(m.emberKey, q);
						}
					}
				}
			}
			resolve(ret);
		}
	}

	/** A request for create (and create many)
	 * type - the type of records to create
	 * set - the set of records to create
	 */
	function Create(store, adapter, type, set, resolve, reject) {
		var serializer = adapter.get('serializer');
		var mapping = serializer.typeMapping(type);
		var typeName = mapping.zinikiGenericName;
		
		/** Serialize the request */
		this.serialize = function() {
			var recs = [];
			set.forEach(function(m) {
				recs.push(adapter.serializeAndRename(type, m));
			});
			var payload = {};
			payload[typeName] = recs;
			return {action:"createMany",contentType:mapping.zinikiContentType,payload:payload};
		}
		
		/** Handle the response when it comes back
		 */
		this.handleActionResponse = function(resp) {
			if (!resp[typeName])
				reject("There was no field " + typeName + " in the payload");
			else {
				var arr = resp[typeName];
				if (arr.length != 1)
					reject("There was not exactly one response in create");
				else
					resolve(arr[0]);
			}
		}
	}
	
	/** A request for update (possibly many) records
	 * type - the type of records to create
	 * set - the set of records to create
	 */
	function Update(store, adapter, type, set, resolve, reject) {
		var serializer = adapter.get('serializer');
		var mapping = serializer.typeMapping(type);
		var typeName = mapping.zinikiGenericName;
		
		/** Serialize the request */
		this.serialize = function() {
			var recs = [];
			set.forEach(function(m) {
				recs.push(adapter.serializeAndRename(type, m));
			});
			var payload = {};
			payload[typeName] = recs;
			return {action:"updateMany",payload:payload};
		}
		
		/** Handle the response when it comes back
		 */
		this.handleActionResponse = function(resp) {
			if (!resp[type.zinikiGenericName])
				reject("There was no field " + type.zinikiGenericName + " in the payload");
			else {
				var arr = resp[type.zinikiGenericName];
				if (arr.length != 1)
					reject("There was not exactly one response in create");
				else
					resolve(arr[0]);
			}
		}
	}
	
	/** Define the Ziniki adapter.  This stays as close to the REST protocol as possible.
	 * 
	 */
	var Adapter = DS.Adapter.extend({
		/** Initialize the adapter by "connecting" to Ziniki.  This actually assumes that Ziniki is
		 * already connected and there are issues with obtaining login information and credentials if
		 * it is not.
		 */
		init: function() {
			this.set('webSocket', Ziniki.getWebSocket());
			this.set('serializer', ZinikiSerializer.create({ container: this.container }));
	    this._super.apply(this, arguments);
		},
		
		/** Find an individual record by its ID.
		 */
		find: function(store, type, id) {
			var self = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var batch = new Batch(self.get('webSocket'));
				batch.add(new Find(store, self, type, id, resolve, reject));
				batch.send();
			});
		},
		
		/** Find all the records in Ziniki which correspond to a given
		 * Ember Data type.
		 */
		findAll: function(store, type, since) {
			var self = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var batch = new Batch(self.get('webSocket'));
				batch.add(new FindAll(store, self, type, resolve, reject));
				batch.send();
			});
		},

		/** Find multiple records in Ziniki which correspond to a given
		 * Ember Data type.
		 */
		findMany: function(store, type, ids, owner) {
			var self = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var batch = new Batch(self.get('webSocket'));
				batch.add(new FindMany(store, self, type, ids, resolve, reject));
				batch.send();
			});
		},

		/** Find multiple records in Ziniki based on following a "HasMany" relationship
		 */
		findHasMany: function(store, record, link, relationship) {
			console.log("I'm not sure about this");
//			var self = this;
//			return new Ember.RSVP.Promise(function(resolve, reject) {
//				var batch = new Batch(self.get('webSocket'));
//				batch.add(new FindMany(store, self, type, ids, resolve, reject));
//				batch.send();
//			});
		},

	  createRecord: function(store, type, record) {
			var self = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var batch = new Batch(self.get('webSocket'));
				self.batchCreate(store, self, batch, type, [record], resolve, reject);
				batch.send();
			});
	  },
		
	  updateRecord: function(store, type, record) {
	  	console.log("update, yo!");
			var self = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var batch = new Batch(self.get('webSocket'));
				self.batchUpdate(store, self, batch, type, [record], resolve, reject);
				batch.send();
			});
	  },
		
	  deleteRecord: function() {
	  	throw "Ziniki does not support standard 'delete()' semantics";
	  },

	  // Place a new create record in a batch
		batchCreate: function(store, adapter, batch, type, set, resolve, reject) {
			batch.add(new Create(store, adapter, type, set, resolve, reject));
		},

	  // Place a new update record in a batch
		batchUpdate: function(store, adapter, batch, type, set, resolve, reject) {
			batch.add(new Update(store, adapter, type, set, resolve, reject));
		},

	  // serialize the object, then rename the resulting hash as appropriate
	  serializeAndRename: function(type, record) {
	  	var hash = this.serialize(record, { includeId: true });
			var mt = ZinikiSerializer.types[type.toString()];
			if (mt && mt.outboundRenames) {
				var map = mt.outboundRenames;
				var ret = {};
				for (var p in hash) {
					if (hash.hasOwnProperty(p)) {
						if (map.hasOwnProperty(p))
							ret[map[p]] = hash[p];
						else
							ret[p] = hash[p];
					}
				}						
			} else
				ret = hash;
			if (record["zinikiCreationOptions"])
				ret["ziniki"] = record["zinikiCreationOptions"];
			return ret;
	  },

	  toString: function() {
	  	return "Ziniki.Adapter";
	  }
		
	});
	
	return Adapter;
});