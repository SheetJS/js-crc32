/* bm.js (C) 2014-present SheetJS -- http://sheetjs.com */
var Benchmark = require('benchmark');
var c = require('ansi')(process.stdout);

function test_end(e) { c.horizontalAbsolute(0).write("✓ "+e.target); c.write('\n'); }

function suite_end() {
	var o = this.filter('fastest');
	var m = typeof o.pluck === 'undefined' ? o.map('name') : o.pluck('name');
	console.log('Fastest is ' + m);
}

function test_cycle(e) { c.horizontalAbsolute(0); c.eraseLine(); c.write("→ "+e.target); }

function BM(name) {
	if(!(this instanceof BM)) return new BM(name);
	console.log("--- " + name + " ---");
	this.suite = new Benchmark.Suite(name, { onComplete: suite_end });
	this.suites = [];
	this.maxlen = 0;
}

BM.prototype.run = function(skip) {
	if(skip) { this.suites.forEach(function(s) { s[1].fn(); }); return; }
	var maxlen = this.maxlen, ss = this.suite;
	this.suites.forEach(function(s) { ss.add(s[0] + new Array(maxlen-s[0].length+1).join(" "), s[1]); });
	if(this.suites.length > 0) this.suite.run();
};

BM.prototype.add = function(msg, test) {
	this.suites.push([msg, {
		onCycle: test_cycle,
		onComplete: test_end,
		defer: false,
		fn: test
	}]);
	this.maxlen = Math.max(this.maxlen, msg.length);
};

module.exports = BM;
