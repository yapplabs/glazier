var OauthView = Ember.View.extend({
  templateName: 'oauth',
  isVisible: Ember.computed.oneWay('controller.showModal')
});

export default OauthView;
