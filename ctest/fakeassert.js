var assert = {};
assert.equal = function(x,y) { if(x !== y) throw new Error(x + " !== " + y); };
