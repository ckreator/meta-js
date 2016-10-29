module.exports = new (require("./proto_closure.js"))();

// check god
function checkRealGod() {
	let realGods = [];
	if (JesusChris.exists())
		realGods.push("Christian God");
	if (Allah.exists())
		realGods.push("Allah");
	if (Krishna.exists())
		realGods.push("Induistic Gods");

	return realGods;
}

checkRealGod(); // -> returns empty array
// people think this means there's a "God of the empty Array"
