var ObjectExtension = Object;
Object.prototype.pipe = function (f) {
    return f(this);
};
String.prototype.trimLeft = function (str) {
    var _this = this;
    var indx = _this.indexOf(str);
    if (indx == 0)
        return _this.substr(indx, str.length);
    else
        return str;
};
String.prototype.trimRight = function (str) {
    var _this = this;
    var lindx = _this.lastIndexOf(str);
    if (lindx == _this.length - str.length)
        return _this.substr(lindx, str.length);
    else
        return str;
};
String.prototype.trimChars = function (str) {
    var _this = this;
    var indx = _this.indexOf(str);
    if (indx == 0)
        return _this.substr(indx, str.length);
    else
        return str;
};
///number extension 
