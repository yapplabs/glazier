function MockPort(name) {
  this.name = name;
  this._events = { };
  this._all = [ ];
  this._errors = [ ];
}

function spy(fn, args) {
  fn.calledWith = fn.calledWith || [];
  fn.calledWith.push(Array.prototype.slice.call(arguments));
}

// Oasis port API
MockPort.prototype = {
  all: function all(callback, binding){
    spy(all, arguments);

    this._all.push([callback, binding]);
  },

  error: function error(callback, binding){
    this._errors.push([callback, binding]);
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

  send: function send(name, event){
    spy(send, arguments);

    this.port._trigger(name, event);
  },

  _trigger: function(name, event) {
    var port = this;
    function invoke(args) {
      return function(tuple) {
        var callback = tuple[0];
        var binding = tuple[1];
        callback.apply(binding, args);
      }
    }
    function processEvents() {
      start();
      var tuples = port._events[name] || [];

      if (port._errors.length > 0) { // if error handlers are installed
        try {
          port._all.forEach(invoke([name, event]));
          tuples.forEach(invoke([event]));
        } catch(e) {
          port._errors.forEach(invoke([e]));
        }
      } else {
        port._all.forEach(invoke([name, event]));
        tuples.forEach(invoke([event]));
      }
    }
    stop();
    // simulate async
    setTimeout(processEvents, 0);
  }
};

function MockChannel(name, port1, port2) {
  this.name = name;

  this.port1 = port1;
  this.port2 = port2;

  port1.port = port2;
  port2.port = port1;
}

export { MockPort, MockChannel };
