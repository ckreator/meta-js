const assert = require("assert");

function calc(expression) {
	let stack = (function(ary = []) {
		return {
			push: (val) => {return ary.push(val)},
			pop: () => {return ary.pop()},
			peek: () => {return ary.length > 0 ? ary[ary.length-1] : null}
		}
	})();
	let queue = (function(ary = []) {
		return { put: (val) => {return ary.push(val)}, get: () => {return ary;} }
	})();
	// all ops are left-associative
	let ops = {
		"+": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a + b)}, prec: 1},
		"-": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a - b)}, prec: 1},
		"*": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a * b)}, prec: 2},
		"/": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a / b)}, prec: 2},
		"neg": {action: (s) => {s.push(s.pop() * -1)}, params: 1, prec: 3}
	};

	// generate tokens
	x = expression.split(/\s*([0-9]+\.[0-9]+|[0-9]+|[\(\)]|[\+\-\/\*])\s*/g).filter(i => i !== "").map(function(i) {
		if (i.match(/[0-9]+/))
			return {type: "num", val: Number(i)};
		if (i.match(/\(|\)/))
			return {type: "paren", val: i};
		if (ops[i] != null)
			return {type: "op", val: i};
	});
	// loop through the splitted arrray
	let prev = x[0];
	let first = true;
	for (let i = 0; i < x.length; i++) {
		let token = x[i];
		// check if number
		if (token.type === "num") {
			queue.put(token.val);
		} else if (token.type === "op") {
			// 1. handle special case - minus
			if (token.val === "-") {
				if (ops[prev] != null || first) {
					// if minus is first token, it's always neg
					// previous token was also an operator
					// therefore, negation
					token.val = "neg";
				}
			}
			// check whether stack is empty
			let otherTok = stack.peek();
			while ((otherTok = stack.peek()) != null && (otherTok === "(" || (ops[token.val].prec <= ops[otherTok].prec))) {
				// token is always left-associative
				if (otherTok === "(")
					break;
				queue.put(stack.pop());
			}
			stack.push(token.val);
		} else if (token.type === "paren") {
			if (token.val === "(")
				stack.push(token.val);
			else {
				// pop off all operators to queue
				let op;
				while ((op = stack.pop()) != null && op !== "(") {
					queue.put(op);
				}
				// add negate operator, if necessary:
				if (op === "neg") {
					queue.put("neg");
				}
			}
		}
		first = false;
		if (token.val !== "(")
			prev = token.val;
	}
	// finally, pop out all operators
	let op;
	while ((op = stack.pop()) != null)
		queue.put(op);
	let rpn = queue.get();
	// now read RPN
	// reuse stack
	for (let i = 0; i < rpn.length; i++) {
		let op = rpn[i];
		if (typeof op === "number")
			stack.push(op);
		else {// must be operator
			// pass the stack directly
			ops[op].action(stack);
		}
	}
	return stack.peek();
}
/*
var tests = [
  ['1+1', 2],
  ['1 - 1', 0],
  ['1* 1', 1],
  ['1 /1', 1],
  ['-123', -123],
  ['123', 123],
  ['2 /2+3 * 4.75- -6', 21.25],
  ['12* 123', 1476],
  ['2 / (2 + 3) * 4.33 - -6', 7.732],
  ["12* 123/-(-5 + 2)", 492],
  //["(123.45*(678.90 / (-2.5+ 11.5)-(((80 - (19))) *33.25)) / 20)", 1],
  ["(123.45*(678.90 / (-2.5+ 11.5)-(((80 - (19))) *33.25)) / 20) - (123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) + (13 - 2)/ -(-11) ", 1],
  ["(1 - 2) + -(-(-(-4)))", 3],
  ["123.45*(678.90 / (-2.5+ 11.5)-(80 -19) *33.25) / 20 + 11", -12042.760875]
];

//123.45 678.90 2.5 neg 11.5 + 80 19 - - / 33.25 * * 20 / + 11


describe("calc", function() {
	tests.forEach(function (m) {
		it(`${m[0]} = ${m[1]} | ${calc(m[0])}`, function(done) {
	  		assert(calc(m[0]) === m[1]);
			done();
		});
	})
})*/

/*
tests.forEach(function (m) {
	assert(calc(m[0]) === m[1]);
})*/


// =================================
// Short calc
// =================================
function mini_calc(expression) {
	let stack = (function(ary = []) { return { push: (val) => ary.push(val), pop: () => ary.pop(), peek: () => ary.length > 0 ? ary[ary.length-1] : null } })(), queue = (function(ary = []) { return { put: (val) => {return ary.push(val)}, get: () => {return ary;} } })();
	let ops = { "+": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a + b)}, prec: 1}, "-": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a - b)}, prec: 1}, "*": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a * b)}, prec: 2}, "/": {action: (s) => {let b = s.pop(), a = s.pop(); s.push(a / b)}, prec: 2}, "neg": {action: (s) => {s.push(s.pop() * -1)}, params: 1, prec: 3} };
	let x = expression.split(/\s*([0-9]+\.[0-9]+|[0-9]+|[\(\)]|[\+\-\/\*])\s*/g).filter(i => i !== "").map(function(i) { return (i.match(/[0-9]+/)) ? {type: "num", val: Number(i)} : (i.match(/\(|\)/)) ? {type: "paren", val: i} : (ops[i] != null) ? {type: "op", val: i} : null; }), prev = x[0], first = true, token = x[0], op, otherTok, rpn, i, useless;
	for (let i = 0; i < x.length; (token.type === "num") ? queue.put(token.val) : () => {}, (token.type === "op") ? stack.push(token.val) : () => {}, prev = token.val !== "(" ? token.val : prev, i++, token = x[i], first = false) {
		if (token.type === "op" && (token.val = (token.val === "-" && (ops[prev] != null || first)) ? "neg" : token.val ) || (() => {if (token.val === "-" && (ops[prev] != null || first)) token.val = "neg";})() ) while ((otherTok = stack.peek()) != null && otherTok !== "(" && (ops[token.val].prec <= ops[otherTok].prec) && queue.put(stack.pop())) { }
		else if (token.type === "paren") token.val === "(" ? stack.push(token.val) : (() => { while ((op = stack.pop()) != null && op !== "(" && queue.put(op)) {}; if (op === "neg") queue.put("neg")})(); }
	while ((op = stack.pop()) != null) queue.put(op);
	for (rpn = queue.get(), i = 0, op = rpn[0]; i < rpn.length; i++, op = rpn[i]) { typeof op === "number" ? stack.push(op) : ops[op].action(stack); }
	return stack.peek();
}

//console.log(mini_calc("1 -5+9/ 3"));

var tests = [
  ['1+1', 2],
  ['1 - 1', 0],
  ['1* 1', 1],
  ['1 /1', 1],
  ['-123', -123],
  ['123', 123],
  ['2 /2+3 * 4.75- -6', 21.25],
  ['12* 123', 1476],
  ['2 / (2 + 3) * 4.33 - -6', 7.732],
  ["12* 123/-(-5 + 2)", 492],
  ["(123.45*(678.90 / (-2.5+ 11.5)-(((80 - (19))) *33.25)) / 20) - (123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) + (13 - 2)/ -(-11) ", 1],
  ["(1 - 2) + -(-(-(-4)))", 3],
  ["123.45*(678.90 / (-2.5+ 11.5)-(80 -19) *33.25) / 20 + 11", -12042.760875]
];

//123.45 678.90 2.5 neg 11.5 + 80 19 - - / 33.25 * * 20 / + 11


describe("mini_calc", function() {
	tests.forEach(function (m) {
		it(`${m[0]} = ${m[1]} | ${mini_calc(m[0])} !`, function(done) {
	  		assert(mini_calc(m[0]) === m[1]);
			done();
		});
	})
})
