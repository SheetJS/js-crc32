# crc32

Standard CRC-32 algorithm implementation in JS (for the browser and nodejs).
Emphasis on correctness and performance.

## Installation

In [nodejs](https://www.npmjs.org/package/crc-32):

    npm install crc-32

In the browser:

    <script lang="javascript" src="crc32.js"></script>

The browser exposes a variable CRC32

## Usage

- `CRC32.buf(byte array or buffer)` assumes the argument is a set of 8 bit
  unsigned integers (e.g. nodejs `Buffer` or simple array of ints)

- `CRC32.bstr(binary string)` interprets the argument as a binary string where
  the `i`-th byte is `str.charCodeAt(i)`

- `CRC32.str(string)` interprets the argument as a standard JS string

## Testing

`make test` will run the nodejs-based test.  To run the in-browser tests, run a
local server and go to the `ctest` directory.  To update the browser artifacts,
run `make ctest`.

## Performance

`make perf` will run performance tests.

Unexpected code patterns were based on performance testing in node and browser:

- [Loop unrolling helps!](http://jsperf.com/crc32-table/2)

## In the future ... 

- Specifying an arbitrary initial CRC value

- Supporting different polynomials (e.g. CRC32C)

## License

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 license are reserved by the Original Author.

[![Build Status](https://travis-ci.org/SheetJS/js-crc32.png?branch=master)](https://travis-ci.org/SheetJS/js-crc32)

[![Coverage Status](https://coveralls.io/repos/SheetJS/js-crc32/badge.png?branch=master)](https://coveralls.io/r/SheetJS/js-crc32?branch=master)

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/ee0e89f8b1d5b861ffbf264b8ce329a6 "githalytics.com")](http://githalytics.com/SheetJS/js-crc32)

