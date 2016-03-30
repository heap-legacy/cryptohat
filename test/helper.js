global.chai = require("chai");
global.sinon = require("sinon");
global.chai.use(require("sinon-chai"));

global.assert = global.chai.assert;
global.expect = global.chai.expect;
