var table = require('../').table;
var old = require('crc-32').bstr;
var cur = require('../').bstr;

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

function sheetjsB(bstr) {
	var b = new Buffer(bstr, 'binary');
	for(var crc = -1, i = 0; i < b.length; ++i) {
		crc = (crc >>> 8) ^ table[(crc ^ b[i]) & 0xFF];
	}
	return crc ^ -1;
}

function sheetjs1(bstr) {
	for(var crc = -1, i = 0; i < bstr.length; ++i) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i)) & 0xFF];
	}
	return crc ^ -1;
}

function sheetjs2(bstr) {
	var L = bstr.length - 1;
	for(var crc = -1, i = 0; i < L;) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	}
	if(i === bstr.length - 1) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i)) & 0xFF];
	return crc ^ -1;
}

function sheetjs3(bstr) {
	for(var crc = -1, i = 0, L=bstr.length-2; i < L;) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	}
	while(i < L+2) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	return crc ^ -1;
}

function sheetjs8(bstr) {
	for(var crc = -1, i = 0, L=bstr.length-7; i < L;) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	}
	while(i < L+7) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	return crc ^ -1;
}

var w = 80000;
var b = new Array(w);
b[0] = "";
for(var i = 1; i !== w; ++i) b[i] = b[i-1] + String.fromCharCode((Math.random()*256)&255);


var assert = require('assert');
function check(foobar) {
	var baseline = old(foobar);
	assert.equal(baseline, sheetjs1(foobar));
	assert.equal(baseline, sheetjs2(foobar));
	assert.equal(baseline, sheetjs3(foobar));
	assert.equal(baseline, sheetjs8(foobar));
	assert.equal(baseline, sheetjsB(foobar));
	assert.equal(baseline, cur(foobar));
	if(i < 100) assert.equal(baseline, node_crc32(foobar));
}

for(var i = 0; i !== w; ++i) {
	var foobar = b[i];
}
var BM = require('./bm');
var suite = new BM('binary string');
suite.add('sheetjs 1', function() { for(var j = 0; j !== w; j+=100) sheetjs1(b[j]); });
suite.add('sheetjs 2', function() { for(var j = 0; j !== w; j+=100) sheetjs2(b[j]); });
suite.add('sheetjs 3', function() { for(var j = 0; j !== w; j+=100) sheetjs3(b[j]); });
suite.add('sheetjs 8', function() { for(var j = 0; j !== w; j+=100) sheetjs8(b[j]); });
suite.add('sheetjs B', function() { for(var j = 0; j !== w; j+=100) sheetjsB(b[j]); });
suite.add('last vers', function() { for(var j = 0; j !== w; j+=100) old(b[j]); });
suite.add('current v', function() { for(var j = 0; j !== w; j+=100) cur(b[j]); });
suite.run();
