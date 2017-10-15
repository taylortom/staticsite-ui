var events = {};

module.exports = {
  on: function(eventName, listener) {
    if(!events[eventName]) {
      events[eventName] = { name: eventName, listeners: [] };
    }
    if(events[eventName].listeners.indexOf(listener) === -1) {
      events[eventName].listeners.push(listener);
    }
  },
  off: function(eventName, listener) {
    if(!events[eventName]) {
      return;
    }
    if(typeof listener === 'function') {
      events[eventName].listeners.splice(events[eventName].listeners.indexOf(listener), 1);
    }
    if(!listener) {
      events[eventName].listeners = [];
    }
    if(events[eventName].listeners.length === 0) {
      delete events[eventName];
    }
  },
  trigger: function(eventName, data) {
    if(!events[eventName]) {
      return;
    }
    events[eventName].listeners.forEach(function(listener) {
      listener.call(document, data);
    });
  }
}
