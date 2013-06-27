import 'conductor' as Conductor;

function sendToRouter(message) {
  return function (context){
    App.then(function(){
      App.__container__.lookup('router:main').send(message, context);
    }).then(null, Conductor.error);
  };
}

export = sendToRouter;
