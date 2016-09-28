function chain(s) {
    console.log(this.buf)
    //this += s;
    let ret = {
        chain: chain
    };
    if (this.buf == null)
        this.buf = s;
    else
        this.buf += " " + s;

    ret.buf = this.buf;
    return ret;
}

function meta(cmd) {
    if (this.ctx == null)
        this.ctx = {};
    let handler = {
        set: function(obj, prop, value) {
            obj[prop] = {};
            obj[prop][value] = new Proxy({}, handler);
        },
        get: function(target, name) {
            if (!(name in target))
                target[name] = new Proxy({}, handler);
            return target[name];
        }
    };
    return {
        ctx: ctx,
        //"add": {
            "property": new Proxy({}, handler),
            "function": {

            }
        //}
    }
}

console.log(chain("hello").chain("world"))
let m = meta("add")["property"][5][9].something.not.real.at.all[19]
console.log("PATH: ", m["/home"]["/katie"]["/Desktop"], m)
