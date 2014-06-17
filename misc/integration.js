if(typeof require !== 'undefined') {
var js_crc32 = require('../');
var buffer_crc32 = require('./buffer-crc32');
var crc32 = require('./crc32');
var node_crc = require('./node-crc');

function z1(bstr) { return js_crc32.bstr(bstr); }
function z2(bstr) { return buffer_crc32.signed(bstr); }
function z3(bstr) { return crc32(bstr); }
function z4(bstr) { return node_crc.crc32(bstr);}

function b1(buf) { return js_crc32.buf(buf); }
function b2(buf) { return buffer_crc32.signed(buf); }
function b3(buf) { return crc32(buf); }
function b4(buf) { return node_crc.crc32(buf); }

function u1(str) { return js_crc32.str(str); }
function u2(str) { return buffer_crc32.signed(str); }

var ntests, len_max;
switch(process.env.MODE) {
	case "A": ntests = 100000; len_max = 256; break;
	case "B": ntests = 10000; len_max = 1024; break;
	case "C": ntests = 10000; len_max = 4096; break;
	case "D": ntests = 1000; len_max = 16384; break;
	case "E": ntests = 1000; len_max = 65536; break;
	case "F": ntests = 100; len_max = 262144; break;
	default:  ntests = 10000; len_max = 1024; break;
}

var btest = true, utest = true;

var bstr_tests = [];
var ustr_tests = [];
var len_min = 1;

var corpus = new Array(0x0800);
for(var k = 0; k < 0x0800; ++k) corpus[k] = String.fromCharCode(k)
len_max --;

k = (Math.random()*0x800)|0;
for(var i = 0; i < ntests; ++i) {
	var l = (Math.random() * (len_max - len_min))|0 + len_min;
	var s = new Array(l), t = new Array(l);
	if(btest) for(var j = 0; j < l; ++j) s[j] = corpus[(i+j+k)&127];
	if(utest) for(var j = 0; j < l; ++j) t[j] = corpus[(i+j+k)&0x7FF];
	var ss = s.join("");
	bstr_tests[i] = [ss, new Buffer(ss)];
	ustr_tests[i] = t.join("");
}

var assert = require('assert');
function fix(str) { return parseInt(str, 16)|0; }
if(btest) for(var j = 0; j != ntests; ++j) {
	assert.equal(z1(bstr_tests[j][0]), b1(bstr_tests[j][1]));

	assert.equal(z1(bstr_tests[j][0]), z2(bstr_tests[j][0]));
	assert.equal(z1(bstr_tests[j][0]), fix(z3(bstr_tests[j][0])));
	assert.equal(z1(bstr_tests[j][0]), fix(z4(bstr_tests[j][0])));

	assert.equal(b1(bstr_tests[j][1]), b2(bstr_tests[j][1]));
	assert.equal(b1(bstr_tests[j][1]), fix(b3(bstr_tests[j][1])));
	assert.equal(b1(bstr_tests[j][1]), fix(b4(bstr_tests[j][1])));
}
if(utest) for(var j = 0; j != ntests; ++j) {
	assert.equal(u1(ustr_tests[j]), u2(ustr_tests[j]));
}

var BM = require('../perf/bm');
var suite = new BM('binary string (' + len_max + ')');
suite.add('js-crc32', function() { for(var j = 0; j != ntests; ++j) z1(bstr_tests[j][0]); });
suite.add('buffer-crc32', function() { for(var j = 0; j != ntests; ++j) z2(bstr_tests[j][0]); });
if(len_max < 4096) {
	suite.add('crc32', function() { for(var j = 0; j != ntests; ++j) z3(bstr_tests[j][0]); });
	suite.add('node_crc', function() { for(var j = 0; j != ntests; ++j) z4(bstr_tests[j][0]); });
}
suite.run();

suite = new BM('buffer (' + len_max + ')');
suite.add('js-crc32', function() { for(var j = 0; j != ntests; ++j) b1(bstr_tests[j][1]); });
suite.add('buffer-crc32', function() { for(var j = 0; j != ntests; ++j) b2(bstr_tests[j][1]); });
if(len_max < 1024) {
	suite.add('crc32', function() { for(var j = 0; j != ntests; ++j) b3(bstr_tests[j][1]); });
	suite.add('node_crc', function() { for(var j = 0; j != ntests; ++j) b4(bstr_tests[j][1]); });
}
suite.run();

var suite = new BM('unicode string (' + len_max + ')');
suite.add('js-crc32', function() { for(var j = 0; j != ntests; ++j) u1(ustr_tests[j]); });
suite.add('buffer-crc32', function() { for(var j = 0; j != ntests; ++j) u2(ustr_tests[j]); });
suite.run();
}
