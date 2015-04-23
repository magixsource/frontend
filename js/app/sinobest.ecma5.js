Array.prototype.indexOf = function (e) {
    for (var i = 0, j; j = this[i]; i++) {
        if (j == e) {
            return i;
        }
    }
    return -1;
}
Array.prototype.lastIndexOf = function (e) {
    for (var i = this.length - 1, j; j = this[i]; i--) {
        if (j == e) {
            return i;
        }
    }
    return -1;
}
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function (m, i) {
            return args[i];
        });
}