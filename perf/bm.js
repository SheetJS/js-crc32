/* ssf.js (C) 2014 SheetJS -- http://sheetjs.com */
var Benchmark = require('benchmark');
var c = require('ansi')(process.stdout);

function test_end() { c.horizontalAbsolute(0).write("✓"); c.write('\n'); }

function suite_end() { console.log('Fastest is ' + this.filter('fastest').pluck('name')); } 

function test_cycle(e) { c.horizontalAbsolute(0); c.eraseLine(); c.write("→ "+e.target); }

function BM(name) {
	if(!(this instanceof BM)) return new BM(name);
	console.log("--- " + name + " ---");
	this.suite = new Benchmark.Suite(name, { onComplete: suite_end });
}

BM.prototype.run = function() { this.suite.run(); };

BM.prototype.add = function(msg, test) {
	this.suite.add(msg, {
		onCycle: test_cycle, 
		onComplete: test_end,
		defer: false, 
		fn: test
	});
};

module.exports = BM;
