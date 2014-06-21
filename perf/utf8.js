var table = require('../').table;

function sheetjs1(utf8) {
	var buf = new Buffer(utf8);
	for(var crc = -1, i = 0; i != buf.length; ++i) {
		crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
	}
	return crc ^ -1;
}

function sheetjs2(utf8) {
	for(var crc = -1, i = 0, L=utf8.length, c, d; i < L;) {
		c = utf8.charCodeAt(i++);
		if(c < 0x80) {
			crc = (crc >>> 8) ^ table[(crc ^ c) & 0xFF];
		} else if(c < 0x800) {
			crc = (crc >>> 8) ^ table[(crc ^ (192|((c>>6)&31))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|(c&63))) & 0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = utf8.charCodeAt(i++) & 1023;
			crc = (crc >>> 8) ^ table[(crc ^ (240|((c>>8)&7))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|((c>>2)&63))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|((d>>6)&15)|(c&3))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|(d&63))) & 0xFF];
		} else {
			crc = (crc >>> 8) ^ table[(crc ^ (224|((c>>12)&15))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|((c>>6)&63))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|(c&63))) & 0xFF];
		}
	}
	return crc ^ -1;
}

var BM = require('./bm');
var suite = new BM('unicode string');

var foobar = "foo bar baz٪☃🍣";
for(var i = 0; i != 4; ++i) foobar += " " + foobar;
suite.add('sheetjs 1', function() { for(var j = 0; j != 1000; ++j) sheetjs1(foobar); });
suite.add('sheetjs 2', function() { for(var j = 0; j != 1000; ++j) sheetjs2(foobar); });
suite.run()
var assert = require('assert');
assert.equal(sheetjs1(foobar), sheetjs2(foobar));

