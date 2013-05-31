function MockPort(name) {
  this.name = name;
  this._events = { };
  this._all = [ ];
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
