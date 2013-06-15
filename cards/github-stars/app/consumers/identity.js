import 'app/helpers/send_to_router' as sendToRouter;
import 'conductor' as Conductor;

var IdentityConsumer = Conductor.Oasis.Consumer.extend({
  events: {
    currentUserChanged: sendToRouter('currentUserChanged')
  }
});

export = IdentityConsumer;
