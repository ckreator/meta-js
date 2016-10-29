/* JSON from HTML

dom = {
	type: "tag",
	tag: "html",
	dom: [
		{
			type: "tag",
			tag: "head"
		},
		{
			type: "tag",
			tag: "body",
			id: 'some-body',
			class: ['first', 'second'],
			dom: [
				{type: "text", text: "Hello there, "},
				{
					tag: "b",
					dom: [
						{type: "text", text:"Dude!"},
					]
				}
			]
		}
	]
}

QUERY:

search => html body#some-body.first.second b  # --> returns the b element
search => html body#some-body.first.second    # --> returns body element
*/

function InputStream(input) {
	let pos = 0, line = 1, col = 0;

	return {
		next: next,
		peek: peek,
		eof: eof,
		croak: croak
	};

	function next() {
		let ch = input.charAt(pos++);
		if (ch == "\n")
			line++, col = 0;
		else
			col++;
		return ch;
	}

	function peek() {
		return input.charAt(pos);
	}

	function eof() {
		return peek() == "";
	}

	function croak(msg) {
		throw new Error(msg + " (" + line + ":" + col + ")");
	}
}

// now the tokenizer

function TokenStream(input) {
	let current = null;

	return {
		next: next,
		peek: peek,
		eof: eof,
		croak: input.croak
	};

	let tags = {

	}

	function is_tag_start(x) {
		return /\</.test(x);
	}

	function is_tag_end(x) {
		return /\>/.test(x);
	}

	function is_whitespace(x) {
		return " \t\n".indexOf(x) >= 0;
	}

	function read_while(predicate) {
		let str = "";
		while (!input.eof() && predicate(input.peek()))
			str += input.next();
		return str;
	}

	function read_until(predicate) {
		let str = "";
		while (!input.eof() && !predicate(input.peek()))
			str += input.next();
		/*if (!input.eof() && predicate(input.peek()))
			str += input.next();*/
		return str;
	}

	function getID(str) {
		let find = str.match(/id\s*=\s*("|')[^\1]*\1/i)
		return find == null ? "" : find[0].split(/\s*=\s*/)[1].replace(/"|'/g, "");
	}

	function getClass(str) {
		let find = str.match(/class\s*=\s*("|')[^\1]*\1/i)
		return find == null ? [] : find[0].split(/\s*=\s*/)[1].replace(/"|'/g, "");
	}

	function read_next() {
		read_while(is_whitespace);
		if (input.eof())
			return null;
		let x = input.peek();
		//console.log("READ_NEXT, x: ", x)
		// TODO: distinguish between division sign and comments
		// skip punctuation
		if (x == ">") {
			input.next();
			return read_next();
		}
		if (x == "<") {
			input.next();
			let val;
			return {
				type: "tag",
				value: (val = read_until(is_tag_end)),//.split(" ")
				tag: val.split(" ")[0],
				id: getID(val),
				class: getClass(val)
			};
		}
		// TODO: do this nicely with an object
		if (x.match(/\w/)) {
			return {
				type: "text",
				text: read_until(is_tag_start)
			};
		}
		input.croak("Can't handle character: " + x);
	}

	function peek() {
		return current || (current = read_next());
	}

	function next() {
		let tok = current;
		current = null;
		return tok || read_next();
	}

	function eof() {
		return peek() == null;
	}
}

// parser should do the following:
// - parse_tag --> should put the previous tag on a stack check whether the closing one gives a match
// - parse_text --> should be able to join text segments from the same depth

// Tag AST looks like this:
// { type: "tag", noCloseRequired: true, decl: "<body id='my-body'>", test: ["Text in body", "Text in body after some nested elements"]}

function Parser(input) {
	let stack = (function(ary = []) {
		return {
			push: (val) => {return ary.push(val)},
			pop: () => {return ary.pop()},
			peek: () => {return ary.length > 0 ? ary[ary.length-1] : null},
			/*search: (f, other) => {
				for (let i = ary.length - 1 || 0; i >= 0; i--) {
					// move on only if the current element is noCloseRequired
					if (!ary[i].noCloseRequired)
						return f(ary[i], other) ? ary[i] : null;

					if (f(ary[i], other))
						return ary[i];
				}
				return null;
			}*/
		}
	})();

	return parse_toplevel();

	function is_tag(x) {
		return i === "<";
	}

	function parse_tag() {
		let str = "";
		//if (is_tag(input.peek())) {
			// move through the whole tag
			while (!input.eof() && input.peek() !== ">") {
				str += input.next();
			}
			str += input.next();
		//}
		return {
			type: "tag",
			tag: str.split(" ")[0].replace(/\<|\>/g, "") || "",
			src: str,
			dom: parse_text()
		};
	}

	function parse_text() {
		let txt = "";
		while (!input.eof() && input.peek() !== "<") {
			txt += input.next();
		}
		return {
			type: "text",
			text: txt,
			dom: parse_tag()
		};
	}

	function parse_toplevel() {
		let dom = [];
		// skip whitespace
		//input.read_while(is_whitespace);
		while (!input.eof()) {
			dom.push(input.next());
		}
		return dom;
	}
}

function HTMLParser(tokens) {
	let dom = {dom: []}, curr = dom.dom;
	let stack = [], currTok, nu;
	// TODO: store the locations of id's
	// TODO: return a larger object that contains also other useful data
	// TODO: Implement searching HTML elements by id
	// TODO: Implement searching HTML elements by tag name
	// TODO: Implement searching HTML elements by class name
	// TODO: Implement searching HTML elements by CSS selectors
	// TODO: Implement searching HTML elements by HTML object collections

	function parseTree() {
		while ((currTok = tokens.next()) && !tokens.eof()) {
			//currTok = tokens[i];
			if (currTok.type == "tag") {
				if (currTok.tag.match(/^\/[a-z]+/i) != null) {
					// TODO: check if tag is closeable and close it only if getting the responding tag
					// get to the last element
					curr = stack.pop();
				} else {
					curr.push({
						type: "tag",
						tag: currTok.tag,
						id: currTok.id || "",
						class: currTok.class || "",
						dom: new Proxy([], {
							get: function(target, name) {
								return name === "." ? target : name === ".." ? curr : target[name];
							}
						})
					});
					stack.push(curr);
					curr = curr[curr.length-1].dom;
				}
			} else {
				curr.push({
					type: "text",
					text: currTok.text
				})
			}
		}
		return dom;
	}

	return parseTree();
}

let s = "<body id='some-body'>Hello there, <b>Dude! <i>italic</i> <i>other italic</i></b> This is other text!</body>"

let ast = HTMLParser(TokenStream(InputStream(s)));

console.log("AST ", JSON.stringify(ast, null, '   '))//HTMLParser(ast))

console.log(ast.dom[0])
