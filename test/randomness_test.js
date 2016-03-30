var cryptohat = require("..");
var _ = require("lodash");

var testNumberRng = function(generator, bits, count) {
  var numbers = [];
  for (var i = 0; i < count; i += 1)
    numbers[i] = generator();
  var uniques = _(numbers).sortBy(_.identity).sortedUniq().value();

  expect(uniques[0]).to.be.at.least(0);
  expect(uniques[uniques.length - 1]).to.be.below(Math.pow(2, bits));

  // This check fails if there are 2 collisions in the set of numbers.
  //
  // The probability of failure can be computed from bits and count. The
  // article below explains the math.
  //   http://preshing.com/20110504/hash-collision-probabilities/
  expect(uniques.length).to.be.at.least(count);

  // This check fails if all numbers fall in the lower half of the range.
  // The probability of that happening is 1/2^count.
  expect(uniques[uniques.length - 1]).to.be.above(Math.pow(2, bits - 1));
};

// Computes Math.pow(2, exponent) - 1, expressed in radix base.
var pow2String = function(exponent, base) {
  var numbers = [];
  var bitsLeft = exponent;
  while (bitsLeft >= 32) {
    numbers.push(Math.pow(2, 32) - 1);
    bitsLeft -= 32;
  }
  numbers.push(Math.pow(2, bitsLeft) - 1);
  numbers.reverse();

  // NOTE: exponent is an uppoer bound for the number of digits needed to
  //       represent an exponent-bit number in the given base
  var string = cryptohat._array32ToString(numbers, base, new Array(exponent));
  return string.replace(/^0+/, "");
};

var testStringRng = function(generator, bits, base, count) {
  var maxValue = pow2String(bits, base);
  var minValue = pow2String(bits - 1, base);
  if (minValue.length != maxValue.length)
    minValue = "0" + maxValue;

  var numbers = [];
  for (var i = 0; i < count; i += 1) {
    numbers[i] = generator();
    expect(numbers[i]).to.match(/^[0-9a-z]+$/);
  }

  var uniques = _(numbers).sortBy(_.identity).sortedUniq().value();
  expect(uniques[uniques.length - 1]).to.be.at.most(maxValue);

  // This check fails if there are 2 collisions in the set of numbers.
  //
  // The probability of failure can be computed from bits and count. The
  // article below explains the math.
  //   http://preshing.com/20110504/hash-collision-probabilities/
  expect(uniques.length).to.be.at.least(count);

  // This check fails if all numbers fall in the lower half of the range.
  // The probability of that happening is 1/2^count.
  expect(uniques[uniques.length - 1]).to.be.above(minValue);
}

describe("testing helper pow2String", function() {
  it("should produce correct results", function() {
    expect(pow2String(16, 16)).to.equal("ffff");
    expect(pow2String(53, 16)).to.equal("1fffffffffffff");
    expect(pow2String(63, 16)).to.equal("7fffffffffffffff");
    expect(pow2String(64, 16)).to.equal("ffffffffffffffff");
    expect(pow2String(127, 16)).to.equal("7fffffffffffffffffffffffffffffff");
    expect(pow2String(128, 16)).to.equal("ffffffffffffffffffffffffffffffff");

    expect(pow2String(4, 10)).to.equal("15");
    expect(pow2String(16, 10)).to.equal("65535");
    expect(pow2String(16, 10)).to.equal("65535");
    expect(pow2String(128, 10)).to.equal
        ("340282366920938463463374607431768211455");
  });
});

describe("cryptohat.generator with base == 0", function() {
  // NOTE: This tests the low-level 32-bit RNG.
  it ("should produce a 32-bit RNG", function() {
    testNumberRng(cryptohat.generator(32, 0), 32, 100);
  });

  // NOTE: This tests the highest RNG precision available.
  it ("should produce a 53-bit RNG", function() {
    testNumberRng(cryptohat.generator(53, 0), 53, 1000);
  });

  // NOTE: This tests the RNGs based on one 32-bit RNG call.
  it ("should produce a 31-bit RNG", function() {
    testNumberRng(cryptohat.generator(31, 0), 31, 50);
  });
  it ("should produce a 30-bit RNG", function() {
    testNumberRng(cryptohat.generator(30, 0), 30, 50);
  });

  // NOTE: This tests the RNGs based on 2 32-bit RNG calls.
  it ("should produce a 52-bit RNG", function() {
    testNumberRng(cryptohat.generator(52, 0), 52, 1000);
  });
  it ("should produce a 51-bit RNG", function() {
    testNumberRng(cryptohat.generator(51, 0), 51, 1000);
  });

  it("should refuse to produce a 54-bit RNG", function() {
    expect(function() { cryptohat.generator(54, 0); }).to.throw(RangeError,
        /^JavaScript numbers can accurately represent at most 53 bits$/);
  });
});

describe("cryptohat.generator with base 10", function() {
  // NOTE: This tests the fast path.
  it("should produce a 32-bit RNG", function() {
    testStringRng(cryptohat.generator(32, 10), 32, 10, 100);
  });
  it("should produce a 53-bit RNG", function() {
    testStringRng(cryptohat.generator(53, 10), 53, 10, 1000);
  });

  // NOTE: These tests check for edge cases on the slow path.
  it("should produce a 63-bit RNG", function() {
    testStringRng(cryptohat.generator(63, 10), 63, 10, 1000);
  });
  it("should produce a 64-bit RNG", function() {
    testStringRng(cryptohat.generator(64, 10), 64, 10, 1000);
  });
  it("should produce a 65-bit RNG", function() {
    testStringRng(cryptohat.generator(65, 10), 65, 10, 1000);
  });
  it("should produce a 128-bit RNG", function() {
    testStringRng(cryptohat.generator(128, 10), 128, 10, 1000);
  });
});

describe("cryptohat.generator with base 16", function() {
  // NOTE: This tests the fast path.
  it("should produce a 32-bit RNG", function() {
    testStringRng(cryptohat.generator(32, 16), 32, 16, 100);
  });
  it("should produce a 53-bit RNG", function() {
    testStringRng(cryptohat.generator(53, 16), 53, 16, 1000);
  });

  // NOTE: These tests check for edge cases on the slow path.
  it("should produce a 63-bit RNG", function() {
    testStringRng(cryptohat.generator(63, 16), 63, 16, 1000);
  });
  it("should produce a 64-bit RNG", function() {
    testStringRng(cryptohat.generator(64, 16), 64, 16, 1000);
  });
  it("should produce a 65-bit RNG", function() {
    testStringRng(cryptohat.generator(65, 16), 65, 16, 1000);
  });
  it("should produce a 128-bit RNG", function() {
    testStringRng(cryptohat.generator(128, 16), 128, 16, 1000);
  });
});

describe("cryptohat.generator", function() {
  it("should refuse to produce a base-37 RNG", function() {
    expect(function() { cryptohat.generator(32, 37); }).to.throw(RangeError,
        /^The base argument must be between 2 and 36$/);
  });
});

describe("cryptohat", function() {
  it("should use a base-16 128-bit RNG by default", function() {
    testStringRng(function() { return cryptohat(); }, 128, 16, 1000);
  });

  it("should use a base-16 RNG by default", function() {
    testStringRng(function() { return cryptohat(64); }, 64, 16, 1000);
  });

  it("should respect the bits and base arguments", function() {
    testStringRng(function() { return cryptohat(64, 10); }, 64, 10, 1000);
  });
});

