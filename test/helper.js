(function(root) {

if (typeof(global) !== "undefined")
  root = global;

root.__test = {};

if (typeof(require) === "function") {
  root.__test.cryptohat = require("..");
  root.chai = require("chai");
  root.__test.hat = require("hat");
  root.__test.lodash = require("lodash");
} else {
  root.__test.cryptohat = root.cryptohat;
  root.__test.hat = root.hat;
  root.__test.lodash = root._;
}

root.assert = root.chai.assert;
root.expect = root.chai.expect;

})(this);
