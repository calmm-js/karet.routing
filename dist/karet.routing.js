(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('partial.lenses'), require('karet'), require('karet.util'), require('path-to-regexp')) :
  typeof define === 'function' && define.amd ? define(['exports', 'partial.lenses', 'karet', 'karet.util', 'path-to-regexp'], factory) :
  (factory((global.karet = global.karet || {}, global.karet.routing = {}),global.L,global.karet,global.karet.util,global.pathToRegexp));
}(this, (function (exports,L,React,U,p2re) { 'use strict';

  p2re = p2re && p2re.hasOwnProperty('default') ? p2re['default'] : p2re;

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var Location = /*#__PURE__*/React.createContext({ path: '', search: '', hash: '' });

  var hold = function hold(held) {
    return L.reader(function (focus) {
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
    var pathValuesIso = L.iso(fromPath, toPath);

    return React.createElement(
      Location.Consumer,
      null,
      function (_ref2) {
        var path = _ref2.path,
            search = _ref2.search,
            hash = _ref2.hash;

        var match = U.view([pathValuesIso, hold()], path);
        var props = {};
        for (var i = 0, n = formals.length; i < n; ++i) {
          var name = formals[i].name;

          props[name] = U.view([name], match);
        }
        return React.createElement(
          React.Fragment,
          null,
          U.when(match, React.createElement(Component, _extends({ path: path, search: search, hash: hash, match: match }, props)))
        );
      }
    );
  };

  exports.Route = Route;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
