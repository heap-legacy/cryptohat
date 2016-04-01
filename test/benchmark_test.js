var cryptohat = require("..");
var hat = require("hat");

// Runs the target function for a number of iterations and returns the number
// of nanoseconds passed per iteration.
var benchmark = function (iterations, code) {
  var t0 = process.hrtime();
  for (var i = 0; i < iterations; ++i) {
    code();
  }
  t1 = process.hrtime();

  return ((t1[0] - t0[0]) * 1e9 + t1[1] - t1[0]) / iterations;
}

var iterations = 4000000;

describe("benchmarking", function() {
  before(function() {
    if (typeof(process) === "object" && typeof(process.env) === "object" &&
        process.env['SKIP_BENCHMARKS']) {
      this.skip();
    }
  });
  describe("cryptohat.generator with base == 0", function() {
    it("is at least 1.5x faster than hat for 32 bits", function() {
      var baseline = benchmark(iterations, function() { return +hat(32, 10); });
      var us = benchmark(iterations, cryptohat.generator(32, 0));
      console.log([baseline / us, "baseline", baseline, "us", us]);
      expect(baseline / us).to.be.at.least(1.5);
    });
    it("is at least 1.5x faster than hat for 53 bits", function() {
      var baseline = benchmark(iterations, function() { return +hat(53, 10); });
      var us = benchmark(iterations, cryptohat.generator(53, 0));
      console.log([baseline / us, "baseline", baseline, "us", us]);
      expect(baseline / us).to.be.at.least(1.5);
    });
  });

  describe("cryptohat.generator with base != 0", function() {
    it("is at most 2x slower than hat for base-10 32-bits", function() {
      var baseline = benchmark(iterations, function() { return hat(32, 10); });
      var us = benchmark(iterations, cryptohat.generator(32, 10));
      console.log([baseline / us, "baseline", baseline, "us", us]);
      expect(baseline / us).to.be.at.least(0.5);
    });
    it("is at most 3x slower than hat for base-10 53-bits", function() {
      var baseline = benchmark(iterations, function() { return hat(53, 10); });
      var us = benchmark(iterations, cryptohat.generator(53, 10));
      console.log([baseline / us, "baseline", baseline, "us", us]);
      expect(baseline / us).to.be.at.least(0.33);
    });
    it("is at most 5x slower than hat for base-36 63-bits", function() {
      var baseline = benchmark(iterations, function() { return hat(63, 36); });
      var us = benchmark(iterations, cryptohat.generator(63, 36));
      console.log([baseline / us, "baseline", baseline, "us", us]);
      expect(baseline / us).to.be.at.least(0.2);
    });
    it("is at most 2x slower than hat for base-16 128-bits", function() {
      var baseline = benchmark(iterations, function() {
        return hat(128, 16);
      });
      var us = benchmark(iterations, cryptohat.generator(128, 16));
      console.log([baseline / us, "baseline", baseline, "us", us]);
      expect(baseline / us).to.be.at.least(0.2);
    });
  });
});
