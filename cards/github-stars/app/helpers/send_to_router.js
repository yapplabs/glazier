function sendToRouter(message) {
  return function (context){
    App.then(function(){
      App.__container__.lookup('router:main').send(message, context);
    });
  };
}

export = sendToRouter;
