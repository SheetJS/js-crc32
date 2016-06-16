#!/usr/bin/env node
/* make_unicode.njs -- generate baselines for tests
 * Copyright (C) 2016-present  SheetJS
 * vim: set ft=javascript: */

var argv = process.argv.slice(2);
var enc = require('codepage').utils.encode;
function arr(x) { return [].slice.call(enc(65001, x)); }
var o = require('./uctable.' + argv[0]).map(arr);

/* node 6 changed default behavior for arrays */
if(+process.version.replace(/v(\d)+\..*/,"$1") >= 6) o = require("util").inspect(o, {maxArrayLength: null});

console.log(o);
