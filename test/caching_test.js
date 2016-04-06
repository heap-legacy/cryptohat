(function() {

var cryptohat = __test.cryptohat;
var generator = cryptohat.generator;

describe("cryptohat.generator", function() {
  describe("with base == 0", function() {
    it("produces different generators for different bit counts", function() {
      expect(generator(33, 0)).not.to.equal(generator(32, 0));
      expect(generator(32, 0)).not.to.equal(generator(31, 0));
    });

    it("caches generators", function() {
      expect(generator(33, 0)).to.equal(generator(33, 0));
      expect(generator(32, 0)).to.equal(generator(32, 0));
      expect(generator(31, 0)).to.equal(generator(31, 0));
    });
  });

  describe("with base != 0", function() {
    it("produces different generators for different bit counts", function() {
      expect(generator(33, 10)).not.to.equal(generator(32, 10));
      expect(generator(32, 10)).not.to.equal(generator(31, 10));
    });

    it("produces different generators for different bases", function() {
      expect(generator(33, 10)).not.to.equal(generator(33, 9));
      expect(generator(32, 9)).not.to.equal(generator(32, 8));
    });
  });
});

})();
