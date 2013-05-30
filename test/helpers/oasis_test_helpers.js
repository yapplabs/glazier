function MockPort(name) {
  this.name = name;
  this._events = { };
  this._all = [ ];
}

function spy(fn, args) {
  fn.calledWith = fn.calledWith || [];
  fn.calledWith.push(Array.prototype.slice.call(arguments));
}

MockPort.prototype = {
  all: function all(callback, binding){
    spy(all, arguments);

    this._all.push([callback, binding]);
  },

  on: function on(eventName, callback, binding) {
    spy(on, arguments);

    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push([callback, binding]);
  },

  off: function off(eventName) {
    spy(off, arguments);

    delete this._events[eventName];
  },

  // this is sending to an iframe, e.g postMessage
  send: function send(name, event){
    spy(send, arguments);
    this.port.trigger(name, event);
  },

  // this will be used from the test, to mimic
  // an iframe posting back
  //
  // e.g emitting message event
  trigger: function(name, event) {
    var port = this;

    function processEvents() {
      port._all.forEach(function(tuple) {
        var callback = tuple[0];
        var binding = tuple[1];

        callback.call(binding, name, event);
      });

      var tuples = port._events[name] || [];

      tuples.forEach(function(tuple) {
        var callback = tuple[0];
        var binding = tuple[1];

        callback.call(binding, event);
      });
    }

    setTimeout(processEvents, 0);
  }
};

function MockChannel(name, portA, portB) {
  this.name = name;

  this.portA = portA;
  this.portB = portB;

  portA.port = portB;
  portB.port = portA;
}

export { MockPort, MockChannel };
