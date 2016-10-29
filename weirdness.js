/*function go(value) {
	let obj = this || {};
	this = this || {};
	this[value] = {};
}*/


function neither() {
	function ret(val) {
		return {
			value: val,
			else: function(doIt) {return doIt(val)}
		};
	}
	for (let i in arguments) {
		if (arguments[i]() !== false) {
			return ret((arguments[i].toString().match(/return\s+[^;}]+\;?}/) || [])[0].replace(/return\s+|\s*;?}$/g, ""));
		}
	}
	return ret(null);
}

neither(function() {return 1 > 0;}).else(i => {console.log(i)});

//.split(/\s*(\-?[0-9]+\.[0-9]+|\-?[0-9]+|[\(\)]|[\+\-\/\*])\s*/g)
