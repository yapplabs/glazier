function assertResolved(thennable){
  stop();
  thennable.then(function(){
    start();
    ok(true, "resolved");
  }, function(e){
    start();
    ok(false, e);
  });
}

function assertRejected(thennable){
  stop();
  thennable.then(function(fulfilledWith){
    start();
    ok(false, fulfilledWith);
  }, function(e){
    start();
    ok(true, "rejected as expected");
  });
}

export { assertResolved, assertRejected };
