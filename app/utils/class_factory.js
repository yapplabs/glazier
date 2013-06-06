function classFactory(klass) {
  return {
    create: function (injections) {
      return klass.extend(injections);
    }
  };
}

export classFactory;
