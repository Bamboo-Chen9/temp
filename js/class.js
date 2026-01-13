// 雅虎圣杯继承
var inherit = (function() {
    var F = function() {};
    return function(son, father) {
        F.prototype = father.prototype;
        son.prototype = new F();
        son.prototype.constuctor = son;
        son.prototype.__super__ = father.prototype;
    }
});