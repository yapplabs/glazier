function sendToRouter(message) {
  return function (context){
    var App = this.card.App;
    App.then(function(){
      App.__container__.lookup('router:main').send(message, context);
    }).then(null, Conductor.error);
  };
}

export default sendToRouter;
