var m = "foobar"; for(var i = 0; i != 11; ++i) m+=m;
var bits = [
	[ "foobar", -1628037227, 1 ],
	[ "foo bar baz", -228401567, 1 ],
	[ "foo bar baz٪", 984445192 ],
	[ "foo bar baz٪☃", 140429620],
	[ "foo bar baz٪☃🍣", 1531648243],
	[ m, 40270464, 1 ]
];
if(typeof module !== "undefined") module.exports = bits;
