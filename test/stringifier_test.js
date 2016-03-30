var cryptohat = require("..");

var array32ToString = cryptohat._array32ToString;
var stringRepeat = cryptohat._stringRepeat;

describe("cryptohat._stringRepeat", function() {
  it("works for count 0", function() {
    expect(stringRepeat("a", 0)).to.equal("");
  });
  it("works for count 1", function() {
    expect(stringRepeat("a", 1)).to.equal("a");
  });
  it("works for count 2", function() {
    expect(stringRepeat("a", 2)).to.equal("aa");
  });
  it("works for count 10", function() {
    expect(stringRepeat("a", 10)).to.equal("aaaaaaaaaa");
  });
});

describe("cryptohat._array32ToString", function() {
  describe("with base == 16", function() {
    it("works on zero", function() {
      expect(array32ToString([], 16, new Array(4))).to.equal("0000");
      expect(array32ToString([0], 16, new Array(4))).to.equal("0000");
      expect(array32ToString([0, 0], 16, new Array(4))).to.equal("0000");
      expect(array32ToString([0, 0, 0, 0], 16, new Array(4))).to.equal("0000");
    });

    it("works on one-element arrays", function() {
      expect(array32ToString([0x1], 16, new Array(4))).to.equal("0001");
      expect(array32ToString([0xf], 16, new Array(4))).to.equal("000f");
      expect(array32ToString([0x1234], 16, new Array(8))).to.equal("00001234");
      expect(array32ToString([0x12345678], 16, new Array(8))).to.equal(
          "12345678");
      expect(array32ToString([0xffffffff], 16, new Array(8))).to.equal(
          "ffffffff");
    });

    it("works on multi-element arrays", function() {
      expect(array32ToString([0xa, 0x12345678], 16, new Array(12))).to.equal(
          "000a12345678");
      expect(array32ToString([0xfedc, 0xba987654], 16, new Array(12))).to.equal(
          "fedcba987654");
      expect(array32ToString([0xffffffff, 0xffffffff, 0xffffffff], 16,
          new Array(24))).to.equal("ffffffffffffffffffffffff");
    });
  });

  describe("with base == 10", function() {
    it("works on one-element arrays", function() {
      expect(array32ToString([0x1], 10, new Array(4))).to.equal("0001");
      expect(array32ToString([0x9], 10, new Array(4))).to.equal("0009");
      expect(array32ToString([0x1234], 10, new Array(8))).to.equal("00004660");
      expect(array32ToString([0x12345678], 10, new Array(12))).to.equal(
          "000305419896");
      expect(array32ToString([0xffffffff], 10, new Array(12))).to.equal(
          "004294967295");
    });

    it("works on multi-element arrays", function() {
      expect(array32ToString([0x1, 0x12345678], 10, new Array(12))).to.equal(
          "004600387192");
      expect(array32ToString([0xfedc, 0xba987654], 10, new Array(16))).to.
          equal("0280223976814164");
      expect(array32ToString([0xffffffff, 0xffffffff, 0xffffffff], 10,
          new Array(32))).to.equal("00079228162514264337593543950335");
    });
  });

  describe("with base == 36", function() {
    it("works on one-element arrays", function() {
      expect(array32ToString([0x1], 36, new Array(4))).to.equal("0001");
      expect(array32ToString([0x9], 36, new Array(4))).to.equal("0009");
      expect(array32ToString([0x1234], 36, new Array(4))).to.equal("03lg");
      expect(array32ToString([0x12345678], 36, new Array(8))).to.equal(
          "0051u7i0");
      expect(array32ToString([0xffffffff], 36, new Array(8))).to.equal(
          "01z141z3");
    });

    it("works on multi-element arrays", function() {
      expect(array32ToString([0x1, 0x12345678], 36, new Array(8))).to.equal(
          "0242y9h4");
      expect(array32ToString([0xfedc, 0xba987654], 36, new Array(12))).to.equal(
          "002rbx48mjx0");
      expect(array32ToString([0xffffffff, 0xffffffff, 0xffffffff], 36,
          new Array(24))).to.equal("000007oiylpimjg5u2ca1ypr");
    });
  });
});
