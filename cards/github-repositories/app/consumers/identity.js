import 'app/helpers/send_to_router' as sendToRouter;
import 'conductor' as Conductor;

var IdentityConsumer = Conductor.Oasis.Consumer.extend({
  getCurrentUser: function(){
    return this.request('currentUser');
  },
  events: {
    currentUserChanged: sendToRouter('currentUserChanged')
  }
});

export = IdentityConsumer;
