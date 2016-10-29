function mustache(s, context) {
    let a = s.split(/({{)([^(}}]+)(}})/);
    for (let i = 0; i < a.length; i++) {
        if (a[i] === "{{") {
            let id = a[i+1].replace(/[ \n\t]/g, "");
            if (context[id] == null)
                return null;
            a.splice(i, 3, context[id]);
        }
    }
    return a.join('');
}

console.log(mustache("Hello, {{   name        }}. How are you?", {
    name: "Kristian"
}))


function mus(s, context) {
    return s.replace(/({{)([^(}}]+)(}})/g, (match) => {return context[match.split(/\{+|\}+/)[1].replace(/\s+/g, "")] || ''});
}

console.log(mus("Hello {{name}}, do you live in {{  location   					}}?", {
    name: "Kristian",
    location: "Vienna"
}))
