;(function ()

  var Monkeylisp = {};

  // Data types:

  var Symbol = function (name) {
    this.name = name;
  };

  var Cons = function (car, cdr) {
    this.car = car;
    this.cdr = cdr;
  };

  var Number = function (value) {
    this.value = value;
  };

  var String = function (value) {
    this.value = value;
  };


)();
