/*let add = new Proxy({}, {
  get: function(target, name) {
    console.log("CALLED: ", arguments);
    return 5;
  }
})*/

/*function traceMethodCalls(obj) {
   let handler = {
	   get(target, propKey, receiver) {
		   const origMethod = target[propKey];
		   return function (...args) {
			   let result = origMethod.apply(this, args);
			   console.log(propKey + JSON.stringify(args)
				   + ' -> ' + JSON.stringify(result));
			   return result;
		   };
	   }
   };
   return new Proxy(obj, handler);
}*/

/*let add = function(x) {
	return traceMethodCalls({
		add(x, y) {
			return x + y;
		}
	})
}*/

/*let add = (function() {
	let num = 0;
	let f = function (x) {num += x; return f};
	f.valueOf = function() { return num; }
	return f;
})()*/

function add(x) {
	let ret = function(i) {
		return add(x + i);
	}
	ret.valueOf = function() {
		return x;
	}
	return ret;
}

//function add(x) {this.val = (this.val || 0) + x; return this}
//add.valueOf = function() { return this.val || 0; }
//add = add.apply(add)

add(5)
console.log(add(5)(2))

//console.log(add(1))
console.log(add(1)(2))
console.log(add(1)(2)(3) - 1)
//console.log(x(5))
