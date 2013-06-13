import 'app/helpers/send_to_router' as sendToRouter;

var IdentityConsumer = Conductor.Oasis.Consumer.extend({
  events: {
    currentUserChanged: sendToRouter('currentUserChanged')
  }
});

export = IdentityConsumer;
