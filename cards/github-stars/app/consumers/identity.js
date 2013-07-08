import sendToRouter from 'app/helpers/send_to_router';
import Consumer from 'conductor';

var IdentityConsumer = Conductor.Oasis.Consumer.extend({
  events: {
    currentUserChanged: sendToRouter('currentUserChanged')
  }
});

export default IdentityConsumer;
