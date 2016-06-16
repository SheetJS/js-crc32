#!/usr/bin/env node
/* crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2 ft=javascript: */

var X;
try { X = require('../'); } catch(e) { X = require('crc-32'); }
var fs = require('fs');
require('exit-on-epipe');

var args = process.argv.slice(2);

var filename;
if(args[0]) filename = args[0];

if(!process.stdin.isTTY) filename = filename || "-";

if(!filename) {
	console.error("crc32: must specify a filename ('-' for stdin)");
	process.exit(1);
}

if(filename === "-h" || filename === "--help") {
	console.log("usage: " + process.argv[0] + " [filename]");
	process.exit(0);
}

if(filename !== "-" && !fs.existsSync(filename)) {
	console.error("crc32: " + filename + ": No such file or directory");
	process.exit(2);
}

if(filename === "-") process.stdin.pipe(require('concat-stream')(process_data));
else process_data(fs.readFileSync(filename));

function process_data(data) {
	console.log(X.buf(data));
}
