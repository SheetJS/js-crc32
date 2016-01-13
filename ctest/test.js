/* vim: set ts=2: */
var X;
if(typeof require !== 'undefined') {
	assert = require('assert');
	describe('source',function(){it('should load',function(){X=require('./');});});
	bits = require('./misc/bits.js');
	crc32table = require('./misc/table.js');
	fs = require("fs");
} else { X = CRC32; }

function readlines(f) { return fs.readFileSync(f, "ascii").split("\n").filter(function(f) { return !!f; }); }

describe('crc32 table', function() {
	it('should match fixed table', function() {
		var badness = 0;
		for(var i = 0; i != crc32table.length; ++i) {
			assert.equal(crc32table[i]|0, X.table[i]);
			if(crc32table[i] !== X.table[i]) ++badness;
		}
		assert.equal(badness, 128);
	});
});

describe('crc32 bits', function() {
	bits.forEach(function(i) {
		var l = i[0].length;
		var msg = i[0];
		if(l > 20) msg = i[0].substr(0,5) + "...(" + l + ")..." + i[0].substr(-5);
		it(msg, function() {
			if(i[2] === 1) assert.equal(X.bstr(i[0]), i[1]|0);
			assert.equal(X.str(i[0]), i[1]|0);
			if(typeof Buffer !== 'undefined') assert.equal(X.buf(new Buffer(i[0])), i[1]|0);
		});
	});
});
if(typeof require !== 'undefined') describe("unicode", function() {
	if(!fs.existsSync("./test_files/uccat.txt")) return;;
	var uccat = readlines("./test_files/uccat.txt");
	uccat.forEach(function(cat) {
		it("Category " + cat, function() {
			if(!fs.existsSync("./test_files/baseline." + cat + ".txt")) return;
			var corpus = readlines("./test_files/baseline." + cat + ".txt");
			var uctable = require("./test_files/uctable." + cat + ".js");
			uctable.forEach(function(c, i) {
				/* since the baselines are passed via utf8, discard invalid codes */
				if(c.charCodeAt(0) >= 0xD800 && c.charCodeAt(0) < 0xE000) return;
				var cc = corpus[i], dd = X.str(c);
				assert.equal(dd, cc, ":" + i + ":" + c + ":" + cc + ":" + dd);
			});
		});
	});
});
