#!/usr/bin/env node
argv = process.argv.slice(2);
var enc = require('codepage').utils.encode;
function arr(x) { return [].slice.call(enc(65001, x)); }
console.log(require('./uctable.' + argv[0]).map(arr));
