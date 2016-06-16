var o = "foo bar baz٪☃🍣";
var m = "foobar"; for(var i = 0; i != 11; ++i) m+=m;
var bits = [
	[ "foobar", -1628037227, 1 ],
	[ "foo bar baz", -228401567, 1 ],
	[ "foo bar baz٪", 984445192 ],
	[ "foo bar baz٪☃", 140429620],
	[ m, 40270464, 1 ],
	[ o, 1531648243],
	[ o+o, -218791105 ],
	[ o+o+o, 1834240887 ]
];
if(typeof module !== "undefined") module.exports = bits;
