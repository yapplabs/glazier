import sendToRouter from 'app/helpers/send_to_router';
import Consumer from 'conductor';

var IdentityConsumer = Conductor.Oasis.Consumer.extend({
  getCurrentUser: function(){
    return this.request('currentUser');
  },
  events: {
    currentUserChanged: sendToRouter('currentUserChanged')
  }
});

export default IdentityConsumer;
