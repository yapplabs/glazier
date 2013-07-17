import Conductor from 'conductor';

var ConfigurationService = Conductor.Oasis.Service.extend({

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method configurationValue
      @param key {String}
    */
    configurationValue: function(key) {
      return Ember.$('meta[name='+ key + ']').attr('content');
    }
  }
});

export default ConfigurationService;
