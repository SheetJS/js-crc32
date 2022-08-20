# crc32

Standard CRC-32 algorithm implementation in JS (for the browser and nodejs).
Emphasis on correctness, performance, and IE6+ support.

## Installation

With a node package manager like `npm`:

```bash
$ npm i --save https://cdn.sheetjs.com/crc-32-latest/crc-32-latest.tgz
```

When installed globally, npm installs a script `crc32` that computes the
checksum for a specified file or standard input.

Hosted versions are available at <https://cdn.sheetjs.com/>:

- `crc32.js` (CommonJS): <https://cdn.sheetjs.com/crc-32-latest/package/crc32.js>
- `crc32.mjs` (ESM): <https://cdn.sheetjs.com/crc-32-latest/package/crc32.mjs>
- `crc32c.js` (CommonJS): <https://cdn.sheetjs.com/crc-32-latest/package/crc32c.js>
- `crc32c.mjs` (ESM): <https://cdn.sheetjs.com/crc-32-latest/package/crc32c.mjs>

## Integration

Using NodeJS or a bundler with `require`:

```js
var CRC32 = require("crc-32");
```

Using NodeJS or a bundler with `import`:

```js
import { bstr, buf, str } from "crc-32";
```

In the browser, the `crc32.js` script can be loaded directly:

```html
<script src="crc32.js"></script>
```

The browser script exposes a variable `CRC32`.

The script will manipulate `module.exports` if available .  This is not always
desirable.  To prevent the behavior, define `DO_NOT_EXPORT_CRC`.

### CRC32C (Castagnoli)

The module and CDNs also include a parallel script for CRC32C calculations.

Using NodeJS or a bundler:

```js
var CRC32C = require("crc-32/crc32c");
```

Using NodeJS or a bundler with `import`:

```js
import { bstr, buf, str } from "crc-32/crc32c";
```

In the browser, the `crc32c.js` script can be loaded directly:

```html
<script src="crc32c.js"></script>
```

The browser exposes a variable `CRC32C`.

The script will manipulate `module.exports` if available .  This is not always
desirable.  To prevent the behavior, define `DO_NOT_EXPORT_CRC`.

## Usage

In all cases, the relevant function takes an argument representing data and an
optional second argument representing the starting "seed" (for rolling CRC).

**The return value is a signed 32-bit integer!**

- `CRC32.buf(byte array or buffer[, seed])` assumes the argument is a sequence
  of 8-bit unsigned integers (nodejs `Buffer`, `Uint8Array` or array of bytes).

- `CRC32.bstr(binary string[, seed])` assumes the argument is a binary string
  where byte `i` is the low byte of the UCS-2 char: `str.charCodeAt(i) & 0xFF`

- `CRC32.str(string[, seed])` assumes the argument is a standard JS string and
  calculates the hash of the UTF-8 encoding.

For example:

```js
// var CRC32 = require('crc-32');               // uncomment this line if in node
CRC32.str("SheetJS")                            // -1647298270
CRC32.bstr("SheetJS")                           // -1647298270
CRC32.buf([ 83, 104, 101, 101, 116, 74, 83 ])   // -1647298270

crc32 = CRC32.buf([83, 104])                    // -1826163454  "Sh"
crc32 = CRC32.str("eet", crc32)                 //  1191034598  "Sheet"
CRC32.bstr("JS", crc32)                         // -1647298270  "SheetJS"

[CRC32.str("\u2603"),  CRC32.str("\u0003")]     // [ -1743909036,  1259060791 ]
[CRC32.bstr("\u2603"), CRC32.bstr("\u0003")]    // [  1259060791,  1259060791 ]
[CRC32.buf([0x2603]),  CRC32.buf([0x0003])]     // [  1259060791,  1259060791 ]

// var CRC32C = require('crc-32/crc32c');       // uncomment this line if in node
CRC32C.str("SheetJS")                           // -284764294
CRC32C.bstr("SheetJS")                          // -284764294
CRC32C.buf([ 83, 104, 101, 101, 116, 74, 83 ])  // -284764294

crc32c = CRC32C.buf([83, 104])                  // -297065629   "Sh"
crc32c = CRC32C.str("eet", crc32c)              //  1241364256  "Sheet"
CRC32C.bstr("JS", crc32c)                       // -284764294   "SheetJS"

[CRC32C.str("\u2603"),  CRC32C.str("\u0003")]   // [  1253703093,  1093509285 ]
[CRC32C.bstr("\u2603"), CRC32C.bstr("\u0003")]  // [  1093509285,  1093509285 ]
[CRC32C.buf([0x2603]),  CRC32C.buf([0x0003])]   // [  1093509285,  1093509285 ]
```

### Best Practices

Even though the initial seed is optional, for performance reasons it is highly
recommended to explicitly pass the default seed 0.

In NodeJS with the native Buffer implementation, it is oftentimes faster to
convert binary strings with `Buffer.from(bstr, "binary")` first:

```js
/* Frequently slower in NodeJS */
crc32 = CRC32.bstr(bstr, 0);
/* Frequently faster in NodeJS */
crc32 = CRC32.buf(Buffer.from(bstr, "binary"), 0);
```

This does not apply to browser `Buffer` shims, and thus is not implemented in
the library directly.

### Signed Integers

Unconventional for a CRC32 checksum, this library uses signed 32-bit integers.
This is for performance reasons.  Standard JS operators can convert between
signed and unsigned 32-bit integers:

```js
CRC32.str("SheetJS")                            // -1647298270 (signed)
CRC32.str("SheetJS") >>> 0                      //  2647669026 (unsigned)
(CRC32.str("SheetJS")>>>0).toString(16)         //  "9dd03922" (hex)

(2647669026 | 0)                                // -1647298270
```

- `x >>> 0` converts a number value to unsigned 32-bit integer.

- `x | 0` converts a number value to signed 32-bit integer.


## Testing

`make test` will run the nodejs-based test.

To run the in-browser tests, run a local server and go to the `ctest` directory.
`make ctestserv` will start a python `SimpleHTTPServer` server on port 8000.

To update the browser artifacts, run `make ctest`.

To generate the bits file, use the `crc32` function from python `zlib`:

```python
>>> from zlib import crc32
>>> x="foo bar baz٪☃🍣"
>>> crc32(x)
1531648243
>>> crc32(x+x)
-218791105
>>> crc32(x+x+x)
1834240887
```

The included `crc32.njs` script can process files or standard input:

```bash
$ echo "this is a test" > t.txt
$ bin/crc32.njs t.txt
1912935186
```

For comparison, the included `crc32.py` script uses python `zlib`:

```bash
$ bin/crc32.py t.txt
1912935186
```

On OSX the command `cksum` generates unsigned CRC-32 with Algorithm 3:

```bash
$ cksum -o 3 < IE8.Win7.For.Windows.VMware.zip
1891069052 4161613172
$ crc32 --unsigned ~/Downloads/IE8.Win7.For.Windows.VMware.zip
1891069052
```

## Performance

`make perf` will run algorithmic performance tests (which should justify certain
decisions in the code).

The [`adler-32` project](https://github.com/SheetJS/js-adler32) has more performance notes

## License

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 license are reserved by the Original Author.

## Badges

[![Sauce Test Status](https://saucelabs.com/browser-matrix/crc32.svg)](https://saucelabs.com/u/crc32)

[![Build Status](https://travis-ci.org/SheetJS/js-crc32.svg?branch=master)](https://travis-ci.org/SheetJS/js-crc32)
[![Coverage Status](http://img.shields.io/coveralls/SheetJS/js-crc32/master.svg)](https://coveralls.io/r/SheetJS/js-crc32?branch=master)
[![Dependencies Status](https://david-dm.org/sheetjs/js-crc32/status.svg)](https://david-dm.org/sheetjs/js-crc32)
[![NPM Downloads](https://img.shields.io/npm/dt/crc-32.svg)](https://npmjs.org/package/crc-32)
[![ghit.me](https://ghit.me/badge.svg?repo=sheetjs/js-xlsx)](https://ghit.me/repo/sheetjs/js-xlsx)
[![Analytics](https://ga-beacon.appspot.com/UA-36810333-1/SheetJS/js-crc32?pixel)](https://github.com/SheetJS/js-crc32)
