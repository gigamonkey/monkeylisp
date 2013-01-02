;(function () {

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

  var nil = null;

  function isNil(o) {
    return o === null;
  }

  // Reader

  function StringStream (s, pos) {
    this.s   = s;
    this.pos = pos || 0;
  }

  var digits = /^[0-9]+$/;
  var whitespace = /\s/;


  StringStream.prototype = {
    peek: function () { return this.s.charAt(this.pos); },
    next: function () { return this.s.charAt(this.pos++); },
    eat: function (what) {
      if (this.next() !== what) {
        throw new Error('Expecting ' + what + ' at position ' + pos);
      }
    }
  }

  function read (input) {
    eatWhitespace(input);
    return Readtable.readFunction(input.peek())(input);
  }

  function isWhitespace (c) {
    return whitespace.test(c);
  }

  function eatWhitespace(input) {
    while (isWhitespace(input.peek())) { input.next(); }
  }

  function readCons (input) {
    var cons, tail, list = nil;

    input.eat('(');

    while (true) {
      eatWhitespace(input);
      c = input.peek();
      if (c === ')') {
        input.next();
        return list;
      } else if (c === '') { // eof
        throw new Error('Unexpected eof while reading list.');
      } else {
        cons = new Cons(read(input), nil)
        if (isNil(list)) {
          list = tail = cons;
        } else {
          tail = tail.cdr = cons;
        }
      }
    }
  };

  function readString (input) {
    var text = '';
    input.eat('"');
    while (true) {
      c = input.next();
      if (c === '"') {
        return new String(text);
      } else if (c === '') {
        throw new Error('Unexpected eof while reading string.');
      } else {
        text += c;
      }
    }
  }

  function isConstituent(c) {
    return !isWhitespace(c) && !Readtable[c];
  }

  function readNumberOrSymbol (input) {
    var text = '';
    while (input.peek() !== '' && isConstituent(input.peek())) {
      text += input.next();
    }
    if (digits.test(text)) {
      return new Number(parseInt(text, 10));
    } else {
      return new Symbol(text);
    }
  }

  var Readtable = {

    '(': readCons,
    '"': readString,
    ')': function (input) { throw new Exception("Unexpected ')'"); }

  };

  Readtable.readFunction = function (c) {
    return this[c] || readNumberOrSymbol;
  };

  console.log(read(new StringStream('(123 456 abc "foobar")')));


})();
