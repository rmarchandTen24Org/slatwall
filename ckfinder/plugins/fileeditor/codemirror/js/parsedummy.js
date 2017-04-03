<<<<<<< HEAD
﻿var DummyParser = Editor.Parser = (function() {
  function tokenizeDummy(source) {
    while (!source.endOfLine()) source.next();
    return "text";
  }
  function parseDummy(source) {
    function indentTo(n) {return function() {return n;}}
    source = tokenizer(source, tokenizeDummy);
    var space = 0;

    var iter = {
      next: function() {
        var tok = source.next();
        if (tok.type == "whitespace") {
          if (tok.value == "\n") tok.indentation = indentTo(space);
          else space = tok.value.length;
        }
        return tok;
      },
      copy: function() {
        var _space = space;
        return function(_source) {
          space = _space;
          source = tokenizer(_source, tokenizeDummy);
          return iter;
        };
      }
    };
    return iter;
  }
  return {make: parseDummy};
})();
=======
﻿var DummyParser = Editor.Parser = (function() {
  function tokenizeDummy(source) {
    while (!source.endOfLine()) source.next();
    return "text";
  }
  function parseDummy(source) {
    function indentTo(n) {return function() {return n;}}
    source = tokenizer(source, tokenizeDummy);
    var space = 0;

    var iter = {
      next: function() {
        var tok = source.next();
        if (tok.type == "whitespace") {
          if (tok.value == "\n") tok.indentation = indentTo(space);
          else space = tok.value.length;
        }
        return tok;
      },
      copy: function() {
        var _space = space;
        return function(_source) {
          space = _space;
          source = tokenizer(_source, tokenizeDummy);
          return iter;
        };
      }
    };
    return iter;
  }
  return {make: parseDummy};
})();
>>>>>>> 04efc81912db0c0c808e100caa063517245d1476
