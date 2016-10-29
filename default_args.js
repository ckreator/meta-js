function defaultArguments(func, params) {
	let src = func.toString(), args;
	let a = [];
	args = src.match(/\([^\)]*\)/)[0].replace(/\(|\)/g, "").split(/,\s*/).map(i => {i = i.replace(/\s*|\/\*[^\*]*\*\//g, "").split(/\s*\=\s*/)[0]; a.push(params[i] != null ? `${i} = ${params[i]}` : i); return params[i] != null ? params[i] : 'undefined' })
	console.log("SETTING ARGS: ", args, a);
	return function() {
		for (let i in arguments)
      		args[i] = arguments[i];
		console.log("applying: ", args)
	  	return func.apply({}, args);
  }
	/*return new Function(a,
		`let nuary = ${'[' + args.toString() + ']'};
		let func = ${src};
		for (let i in arguments) {
		  nuary[i] = arguments[i]
    }
		return func.apply({}, nuary);`
	)*/
}


//var timesFive = function () { var five = 5; return function (a) { return five * x; }; }();
//let a = defaultArguments(timesFive, {'a': '5'})
//console.log(a(10))

function add(a,b) { return a+b; }
var add_ = defaultArguments(add,{b:9, a:8});
console.log(add_(10))
var add_ = defaultArguments(add_,{b:3});
//add_(11)
console.log(add_())
