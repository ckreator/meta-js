/*let funcs = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
let ops = {'plus': '+', 'minus': '-', 'times': '*', 'dividedBy': '/'}

for (let i in funcs) {
  global[funcs[i]] = new Function(`return function ${funcs[i]}(f) {return f != null ? f(${i}) : ${i}}`).call(this)
}

for (let i in ops) {
  global[i] = new Function('some', `return function(x) { return x ${ops[i]} some; }`);
}*/

// ================================
// Fluent Calculator
// ================================
function enclose() {
	let ops = {'plus': '+', 'minus': '-', 'times': '*', 'dividedBy': '/'}
	let nums = {zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10}
	let register = []
	let handle = {
		get: (target, name) => (register = register.concat(nums[name]))[register.length-1]
	};

	for (let i in ops)
	  Number.prototype[i] = new Proxy({}, {
		  get: (target, name) => ops[name] != null ? undefined : (register = register.concat(new Function('a', 'b', `return a ${ops[i]} b;`).call({}, register.pop(), nums[name])))[register.length-1]
	  })
	return new Proxy(nums, handle);
}

FluentCalculator = enclose();

console.log(FluentCalculator.one.minus.three.plus.one.plus.three);
