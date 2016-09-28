function ProtoClosure() {
    var val = 0;
    return function ProtoClosure() {
        var table, instance;

        function ProtoClosure() {
            //val++;
            console.log("val: ", val++)
            return instance;
        }

        table = {};
        ProtoClosure.prototype = this;
        //ProtoClosure.prototype.test = 19;
        var PR = ProtoClosure;
        instance = new PR();
        instance.constructor = ProtoClosure;
        instance.count = 0;
        return instance;
    }
}

module.exports = ProtoClosure;
var PC = ProtoClosure();
console.log("nu: ", ProtoClosure())

var pc = new PC();
var pc1 = new PC();
console.log(pc)
/*



function Universe() {
    var instance;
    Universe = function () {
       return instance;
    };
    Universe.prototype = this;
    instance = new Universe();
    instance.constructor = Universe;
    instance.start_time = 0;
    instance.bang = "Big";
    return instance;
}
// testing
Universe.prototype.nothing = true;
var uni = new Universe();
uni.test = 22;
//QUESTION: how does it manage to change the prototype of singleton?!
Universe.prototype.everything = true;
var uni2 = new Universe();
console.log("uni: ", uni, uni2)
uni2.test = 28;
console.log("uni: ", uni, uni2)
uni.nothing && uni.everything && uni2.nothing && uni2.everything; // true
*/
