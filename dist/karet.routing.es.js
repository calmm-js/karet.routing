import { reader, iso } from 'partial.lenses';
import { createContext, createElement, Fragment } from 'karet';
import { view, when } from 'karet.util';
import p2re from 'path-to-regexp';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Location = /*#__PURE__*/createContext({ path: '', search: '', hash: '' });

var hold = function hold(held) {
  return reader(function (focus) {
    if (undefined === focus) {
      return held;
    } else {
      return held = focus;
    }
  });
};

var Route = function Route(_ref) {
  var pattern = _ref.path,
      Component = _ref.Component;

  var formals = [];
  var pathRE = p2re(pattern, formals);
  var toPath = p2re.compile(pattern);
  var fromPath = function fromPath(path) {
    var match = pathRE.exec(path);
    if (null !== match) {
      var values = {};
      for (var i = 0, n = formals.length; i < n; ++i) {
        // XXX Handle optional and repeat parameters?
        var value = match[i + 1];
        var name = formals[i].name;

        values[name] = undefined === value ? value : decodeURIComponent(value);
      }
      return values;
    }
  };
  var pathValuesIso = iso(fromPath, toPath);

  return createElement(
    Location.Consumer,
    null,
    function (_ref2) {
      var path = _ref2.path,
          search = _ref2.search,
          hash = _ref2.hash;

      var match = view([pathValuesIso, hold()], path);
      var props = {};
      for (var i = 0, n = formals.length; i < n; ++i) {
        var name = formals[i].name;

        props[name] = view([name], match);
      }
      return createElement(
        Fragment,
        null,
        when(match, createElement(Component, _extends({ path: path, search: search, hash: hash, match: match }, props)))
      );
    }
  );
};

export { Route };
