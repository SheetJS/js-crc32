var T = require('../').table;
var old = require('crc-32').str;
var cur = require('../').str;

function sheetjs1(utf8) {
	var buf = new Buffer(utf8);
	for(var C = -1, i = 0; i != buf.length; ++i) {
		C = (C >>> 8) ^ T[(C ^ buf[i]) & 0xFF];
	}
	return C ^ -1;
}

function sheetjs2(str) {
	var C = -1;
	for(var i = 0, L=str.length, c, d; i < L;) {
		c = str.charCodeAt(i++);
		if(c < 0x80) {
			C = (C>>>8) ^ T[(C ^ c)&0xFF];
		} else if(c < 0x800) {
			C = (C>>>8) ^ T[(C ^ (192|((c>>6)&31)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(c&63)))&0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
			C = (C>>>8) ^ T[(C ^ (240|((c>>8)&7)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((c>>2)&63)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(d&63)))&0xFF];
		} else {
			C = (C>>>8) ^ T[(C ^ (224|((c>>12)&15)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((c>>6)&63)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(c&63)))&0xFF];
		}
	}
	return C ^ -1;
}

var foobar = "foo bar baz٪☃🍣";
for(var i = 0; i != 4; ++i) foobar += " " + foobar;

var assert = require('assert');
function check(foobar) {
	var baseline = old(foobar);
	assert.equal(baseline, sheetjs1(foobar));
	assert.equal(baseline, sheetjs2(foobar));
	assert.equal(baseline, cur(foobar));
}

var BM = require('./bm');
var suite = new BM('unicode string (' + foobar.length + ')');
suite.add('sheetjs 1', function() { for(var j = 0; j != 1000; ++j) sheetjs1(foobar); });
suite.add('sheetjs 2', function() { for(var j = 0; j != 1000; ++j) sheetjs2(foobar); });
suite.add('last vers', function() { for(var j = 0; j != 1000; ++j) old(foobar, 0) ; });
suite.add('current v', function() { for(var j = 0; j != 1000; ++j) cur(foobar, 0); });
suite.run();

function doit(foobar) {
	check(foobar);
	var s = new BM('unicode string (' + foobar.length + ')');
	s.add('sheetjs 1', function() { sheetjs1(foobar); });
	s.add('sheetjs 2', function() { sheetjs2(foobar); });
	s.add('last vers', function() { old(foobar, 0); });
	s.add('current v', function() { cur(foobar, 0); });
	s.run();
}

for(var i = 0; i != 4; ++i) foobar += " " + foobar;
doit(foobar);

foobar += " " + foobar;
doit(foobar);

foobar += " " + foobar;
doit(foobar);
