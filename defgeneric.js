function defgeneric(name) {
	let ctx = {};
	return {
		defmethod: defmethod
	};

	function defmethod(proto, func, opts) {
		let f = new Function(``)
	}
}
