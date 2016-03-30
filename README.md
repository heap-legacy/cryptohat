# Hat-Compatible CSPRNG

[![Build Status](https://travis-ci.org/heap/cryptohat.svg?branch=master)](https://travis-ci.org/heap/cryptohat)
[![Coverage Status](https://coveralls.io/repos/github/heap/cryptohat/badge.svg?branch=master)](https://coveralls.io/github/heap/cryptohat?branch=master)
[![Dependency Status](https://gemnasium.com/heap/cryptohat.svg)](https://gemnasium.com/heap/cryptohat)
[![NPM Version](http://img.shields.io/npm/v/cryptohat.svg)](https://www.npmjs.org/package/cryptohat)

This is a [node.js](https://nodejs.org/) package that implements
[hat](https://www.npmjs.com/package/hat)'s main API, but uses a
[cryptographically secure pseudo-random number generator](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator)
to generate the random identifiers. This is especially beneficial when using
older versions of [V8](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)
that exhibit [this bug](https://bugs.chromium.org/p/v8/issues/detail?id=4566).

In our use cases, `cryptohat` takes up to 3x more time to produce a random
identifier than `hat`. `cryptohat` also exposes an alternative API that
produces random *numbers* up to 2x faster than `hat`, while still using a
CSPRNG.


## Prerequisites

This package is tested on node.js 0.10 and above. Browser support is planned
for a future version.


## Installation

Install using [npm](https://www.npmjs.com/).

```bash
npm install cryptohat@0.1.x --save
```


## Usage

`cryptohat` implements the `hat(bits, base)` API. The function takes in the
desired number of bits of randomness and the
[base/radix](https://en.wikipedia.org/wiki/Radix) that will be used to
represent the returned random number, and returns a string. The returned
strings are guaranteed to have the same length for a given bits/base
combination. As long as you don't need the `hat.rack` method, `cryptohat` can
be used as a drop-in replacement.

```javascript
var hat = require('cryptohat');

hat();  // '39a00e331acce7516a8ea69b85e191f0'
hat();  // '00549f7401ac0ba9ea1b791f50bc7b1e'
hat(53, 10);  // '6738095220277140'
```

Pass in zero (0) for the base argument to get a number. This is significantly
faster than obtaining a string and converting it into a number. Keep in mind
that JavaScript numbers can accurately represent integers of at most 53 bits.

```javascript
var cryptohat = require('cryptohat');

cryptohat(53, 0);  // 6738095220277140
cryptohat(32, 0);  // 3840742823
cryptohat(63, 0);  // RangeError: JavaScript numbers can accurately represent at most 53 bits
```

For maximum throughput, use the `cryptohat.generator` API. It takes exactly the
same arguments as the `hat` API, but it returns a generator function. Calling
the function yields random numbers or identifiers.

```javascript
var rng1 = cryptohat.generator(53, 0);
rng1();  // 4438236126178078
rng1();  // 187896805323588

var rng2 = cryptohat.generator(32, 10);
rng2();  // '0053668130'
rng2();  // '1939036909'
```


## Development

After cloning the repository, install the dependencies.

```bash
npm install
```

Make sure the tests pass after making a change.

```bash
SKIP_BENCHMARKS=1 npm test
```

When adding new functionality, make sure it has good test coverage and that it
does not regress the code's performance.

```bash
SKIP_BENCHMARKS=1 npm run cov
npm test
```

When adding new functionality, also make sure that the documentation looks
reasonable.

```bash
npm run doc
```

If you submit a
[pull request](https://help.github.com/articles/using-pull-requests/),
[Travis CI](https://travis-ci.org/) will run the test suite against your code
on the node versions that we support. Please fix any errors that it reports.


## Copyright

Copyright (c) 2016 Heap Inc., released under the MIT license.
