/* vim: set ts=2: */
var X;
if(typeof require !== 'undefined') {
	assert = require('assert');
	describe('source',function(){it('should load',function(){X=require('./');});});
	bits = require('./misc/bits.js');
	crc32table = require('./misc/table.js');
	fs = require("fs");
} else { X = CRC32; }

function readlines(f) { return fs.readFileSync(f, "ascii").split("\n"); }

function msieversion()
{
	if(typeof window == 'undefined') return Infinity;
	if(typeof window.navigator == 'undefined') return Infinity;
	var ua = window.navigator.userAgent
	var msie = ua.indexOf ( "MSIE " )
	if(msie < 0) return Infinity;
	return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
}

describe('crc32 table', function() {
	it('should match fixed table', function() {
		var overflow = 0;
		for(var i = 0; i != crc32table.length; ++i) {
			assert.equal(crc32table[i]|0, X.table[i]);
			if(crc32table[i] !== X.table[i]) ++overflow;
		}
		assert.equal(overflow, 128);
	});
});

describe('crc32 bits', function() {
	bits.forEach(function(i) {
		var msg = i[0], l = i[0].length, L = i[1]|0;
		if(l > 20) msg = i[0].substr(0,5) + "...(" + l + ")..." + i[0].substr(-5);
		if(l > 100 && msieversion() < 9) return;
		if(l > 20000 && typeof Buffer === 'undefined') return;
		it(msg, function() {
			if(i[2] === 1) assert.equal(X.bstr(i[0]), L);
			assert.equal(X.str(i[0]), i[1]|0);
			if(typeof Buffer !== 'undefined') assert.equal(X.buf(new Buffer(i[0])), L);
			var len = i[0].length, step = len < 20000 ? 1 : len < 50000 ? Math.ceil(len / 20000) : Math.ceil(len / 2000);
			for(var x = 0; x < len; x += step) {
				if(i[0].charCodeAt(x) >= 0xD800 && i[0].charCodeAt(x) < 0xE000) continue;
				if(i[2] === 1) {
					var bstrcrc = X.bstr(i[0].substr(x), X.bstr(i[0].substr(0, x)));
					assert.equal(bstrcrc, L);
				}
				var strcrc = X.str(i[0].substr(x), X.str(i[0].substr(0, x)));
				assert.equal(strcrc, i[1]|0);
				if(typeof Buffer !== 'undefined') {
					var buf = new Buffer(i[0]);
					var bufcrc = X.buf(buf.slice(x), X.buf(buf.slice(0, x)));
					assert.equal(bufcrc, L);
				}
			}
		});
	});
});
if(typeof require !== 'undefined') describe("unicode", function() {
	if(!fs.existsSync("./test_files/uccat.txt")) return;
	var uccat = readlines("./test_files/uccat.txt");
	uccat.forEach(function(cat) {
		it("Category " + cat, function() {
			if(!fs.existsSync("./test_files/baseline." + cat + ".txt")) return;
			var corpus = readlines("./test_files/baseline." + cat + ".txt");
			var uctable = require("./test_files/uctable." + cat + ".js");
			for(var ucidx = 0; ucidx < uctable.length; ++ucidx) {
				var c = uctable[ucidx];
				/* since the baselines are passed via utf8, discard invalid codes */
				if(c.charCodeAt(0) >= 0xD800 && c.charCodeAt(0) < 0xE000) continue;
				var cc = corpus[ucidx], dd = X.str(c);
				assert.equal(dd, cc, ":" + ucidx + ":" + c + ":" + cc + ":" + dd);
				if(typeof Buffer !== 'undefined') {
					var ee = X.buf(new Buffer(c, "utf8"));
					assert.equal(ee, cc, ":" + ucidx + ":" + c + ":" + cc + ":" + ee);
					var ff = X.bstr(String.fromCharCode.apply(null, new Buffer(c, "utf8")));
					assert.equal(ff, cc, ":" + ucidx + ":" + c + ":" + cc + ":" + ff);
				}
			};
		});
	});
});
if(typeof require !== 'undefined') describe("corpora", function() {
	require("./test_files/corpus.json").forEach(function(text) {
		if(!fs.existsSync(text[1])) return;
		it("should match '" + text[0] + "' (" + text[2] + ")", function() {
			assert.equal(text[2], X.buf(fs.readFileSync(text[1])));
		});
	});
});
