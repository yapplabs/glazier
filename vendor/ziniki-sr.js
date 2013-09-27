define("ziniki/sr",
  ["ziniki"], function (Ziniki) {
	
   "use strict";
   
	/** We need to keep a number of elements in line to record
	 * all the things we need to do between the Ember models and the Ziniki models.
	 * This record is indexed multiple ways but exists once for each Ember type.
	 */
	function TypeMapping(type, emberKey, generic, content) {
		this.type = type;
		this.emberKey = emberKey;
		this.zinikiGenericName = generic;
		this.zinikiContentType = content;
		this.findByKey = null;
		this.outboundRenames = {};
		this.inboundRenames = {};
		
		/** Allow the user to specify that a field has a different name in Ember to what it does in Ziniki
		 */
		this.renameField = function(ember, ziniki) {
			this.outboundRenames[ember] = ziniki;
			this.inboundRenames[ziniki] = ember;
		}

		/** Specify that the id field has a "natural" key, rather than a Ziniki ID.
		 * In this case, there must be an index to find by ID.
		 */
		this.naturalKey = function(ziniki, findByKey) {
			if (this.findByKey)
				throw "Cannot specify more than one natural key";
			this.outboundRenames['id'] = ziniki;
			this.inboundRenames[ziniki] = 'id';
			
			// TODO: surely we need to map the actual id to something else?
			// Will that just work without a specific slot to place it in?
			
			if (findByKey.lastIndexOf(".") != -1)
				this.findByKey = findByKey;
			else {
				var pkgIdx = this.zinikiGenericName.lastIndexOf(".");
				var pkg = this.zinikiGenericName.substr(0, pkgIdx);
				this.findByKey = pkg+"."+findByKey;
			}
		}
	}
	
	/** The serializer is mainly responsible for doing any class and field renaming that we need
	 * In order to support this, it provides static methods to set up the bindings.
	 */
	 var ZinikiSerializer = DS.JSONSerializer.extend({
		init: function() {
			this._super();
			this.set('bindings', {});
			console.log("Creating Ziniki Serializer");
		},
		
		debugInfo: "ZinikiSerializer",

		// this overrides the parent method
		simpleTypeName: function(type) {
			if (type.mappedName)
				return type.mappedName;
			var name = type.toString();
	    var spl = name.split(".");
	    return spl[spl.length - 1];
		},

		// get the name of the Ziniki projection type
		rootForType: function(type) {
			var tn = type.toString();
			var bindings = ZinikiSerializer.types;
			var forMe = bindings[tn];
			if (forMe && forMe.zinikiGenericName)
				return forMe.zinikiGenericName;
			var ns = tn.substr(0, tn.lastIndexOf("."));
			var defaultPackage = ZinikiSerializer.packages[ns];
			if (!defaultPackage)
				throw "There is no binding for type '" + type + "' and there is no default package for namespace '" + ns + "'";
			var mapTo = this.simpleTypeName(type);
			return defaultPackage.pkgName + "." + mapTo;
		},
		
		// get the content type by a similar mechanism
		contentType: function(type) {
			var tn = type.toString();
			var bindings = ZinikiSerializer.types;
			var forMe = bindings[tn];
			if (forMe && forMe.zinikiContentType)
				return forMe.zinikiContentType;
			var ns = tn.substr(0, tn.lastIndexOf("."));
			var defaultPackage = ZinikiSerializer.packages[ns];
			if (!defaultPackage)
				throw "There is no binding for type '" + type + "' and there is no default package for namespace '" + ns + "'";
			var mapTo = this.simpleTypeName(type);
			return defaultPackage.pkgName + "." + mapTo.charAt(0).toLowerCase() + mapTo.slice(1);
		},
		
		// and get the whole type mapping process
		typeMapping: function(type) {
			var tn = type;
			if (!(tn instanceof String))
				tn = tn.toString();
			var bindings = ZinikiSerializer.types;
			return bindings[tn];
		},
		
		fromZinikiType: function(zinikiType) {
			var mappings = ZinikiSerializer.inboundTypes;
			var forMe = mappings[zinikiType];
			if (forMe && forMe.type)
				return forMe;
			throw "Cannot find the local type for " + zinikiType;
			/*
			var ns = tn.substr(0, tn.lastIndexOf("."));
			var defaultPackage = ZinikiSerializer.packages[ns];
			if (!defaultPackage)
				throw "There is no binding for type '" + type + "' and there is no default package for namespace '" + ns + "'";
			var mapTo = this.simpleTypeName(type);
			return defaultPackage.pkgName + "." + mapTo;
			*/
		},

		/** Upon return from Ziniki, we need to rename a bunch of things.
		 * Do this here, recursively over the input
		 */
		mapArray: function(type, array) {
			var ret = [];
			for (var i=0;i<array.length;i++)
				ret.push(this.mapNames(type, array[i]));
			return ret;
		},
		mapNames: function(type, hash) {
			var mt = ZinikiSerializer.types[type.toString()];
			if (mt && mt.inboundRenames) {
				var map = mt.inboundRenames;
				var ret = {};
				for (var p in hash) {
					if (hash.hasOwnProperty(p)) {
						if (map.hasOwnProperty(p))
							ret[map[p]] = hash[p];
						else
							ret[p] = hash[p];
					}
				}
				return ret;
			}
			return hash;
		},
		
		// pluralization is for other people ...
		pluralize: function(s) {
			return s;
		}

	});
	
	ZinikiSerializer.reopenClass({
		packages: {},
		types: {},
		inboundTypes: {},
		
		mapType: function(type, emberKey, zgeneric, zcontent) {
			var ret = new TypeMapping(type, emberKey, zgeneric, zcontent);
			this.types[type.toString()] = ret;
			if (zgeneric)
				this.inboundTypes[zgeneric] = ret; 
			return ret;
		}
	})
	
	return ZinikiSerializer;
});
