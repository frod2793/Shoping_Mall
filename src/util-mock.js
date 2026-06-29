module.exports = {
  deprecate: function(fn) { return fn; },
  inherits: function(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    }
  },
  promisify: function(fn) { return fn; },
  types: {
    isUint8Array: function(val) { return val instanceof Uint8Array; }
  }
};
