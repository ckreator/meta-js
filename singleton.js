
//PC = PC();

var pc = require("./test_1.js");
var pc1 = require("./test_2.js");

console.log("pc: ", pc.constructor, pc1)

pc.test += 19;
console.log("pc: ", pc, pc1)
