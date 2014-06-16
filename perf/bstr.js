var table = require('../').table;

function strToArr(str) {
	// sweet hack to turn string into a 'byte' array
	return Array.prototype.map.call(str, function (c) {
		return c.charCodeAt(0);
	});
}

	function crcTable(arr, append) {
		var crc, i, l;

		// if we're in append mode, don't reset crc
		// if arr is null or undefined, reset table and return
		if (typeof crcTable.crc === 'undefined' || !append || !arr) {
			crcTable.crc = 0 ^ -1;

			if (!arr) {
				return;
			}
		}

		// store in temp variable for minor speed gain
		crc = crcTable.crc;

		for (i = 0, l = arr.length; i < l; i += 1) {
			crc = (crc >>> 8) ^ table[(crc ^ arr[i]) & 0xff];
		}

		crcTable.crc = crc;

		return crc ^ -1;
	}

function node_crc32(bstr) {
	return crcTable(strToArr(bstr));
}

function sheetjs1(bstr) { 
	for(var crc = -1, i = 0; i != bstr.length; ++i) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i)) & 0xFF];
	}
	return crc ^ -1;
}

function sheetjs2(bstr) { 
	for(var crc = -1, i = 0, L=bstr.length-1; i < L;) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	}
	if(i === L) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	return crc ^ -1;
}

function sheetjs3(bstr) { 
	for(var crc = -1, i = 0, L=bstr.length-2; i < L;) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	}
	if(i === L++) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	if(i === L++) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	return crc ^ -1;
}

var BM = require('./bm');
var suite = new BM('binary string');

var foobar = "foobarbazqux";
foobar += " " + foobar;
foobar += " " + foobar;
foobar += " " + foobar;
foobar += " " + foobar;
suite.add('npm crc32', function() { for(var j = 0; j != 1000; ++j) node_crc32(foobar); });
suite.add('sheetjs 1', function() { for(var j = 0; j != 1000; ++j) sheetjs1(foobar); });
suite.add('sheetjs 2', function() { for(var j = 0; j != 1000; ++j) sheetjs2(foobar); });
suite.add('sheetjs 3', function() { for(var j = 0; j != 1000; ++j) sheetjs3(foobar); });
suite.run();

var assert = require('assert');
assert.equal(node_crc32(foobar), sheetjs1(foobar));
assert.equal(node_crc32(foobar), sheetjs2(foobar));
assert.equal(node_crc32(foobar), sheetjs3(foobar));
