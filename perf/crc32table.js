var t=[], poly = 0xEDB88320;
function node_crc32() {
	var c, n, k;

	for (n = 0; n < 256; n += 1) {
		c = n;
		for (k = 0; k < 8; k += 1) {
			if (c & 1) {
				c = poly ^ (c >>> 1);
			} else {
				c = c >>> 1;
			}
		}
		t[n] = c >>> 0;
	}
}

function node_pako() {
	var c, table = [];

	for(var n =0; n < 256; n++){
		c = n;
		for(var k =0; k < 8; k++){
			c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		}
		table[n] = c;
	}

	return table;
}

function sheetjs1() {
	var c, table = [];

	for(var n =0; n != 256; ++n){
		c = n;
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
		table[n] = c;
	}

	return table;
}

function sheetjs2() {
	var c, table = new Array(256);

	for(var n =0; n != 256; ++n){
		c = n;
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		table[n] = c;
	}

	return table;
}

var BM = require('./bm');
var suite = new BM('building crc32 table');

suite.add('npm crc32', function() { for(var j = 0; j != 1000; ++j) node_crc32(); });
suite.add('npm  pako', function() { for(var j = 0; j != 1000; ++j) node_pako(); });
suite.add('sheetjs 1', function() { for(var j = 0; j != 1000; ++j) sheetjs1(); });
suite.add('sheetjs 2', function() { for(var j = 0; j != 1000; ++j) sheetjs2(); });
suite.run()

var assert    = require('assert');
var m1 = (node_pako());
var m2 = (sheetjs1());
var m3 = (sheetjs2());

assert.equal(m1.length, m2.length);
assert.equal(m1.length, m3.length);
for(var i = 0; i != m1.length; ++i) { assert.equal(m1[i], m2[i]); assert.equal(m1[i], m3[i]); }
