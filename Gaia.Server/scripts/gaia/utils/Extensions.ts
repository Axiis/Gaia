

interface Object {
    pipe<O>(func: (arg: any) => O): O;
}

interface String {
    trimLeft(str: string): string;
    trimRight(str: string): string;
    trimChars(str: string): string;
}

module Gaia.Extensions {

    ///object extension

    const ObjectExtension = Object;

    Object.prototype.pipe = function <O>(f: (arg: any) => O) {
        return f(this);
    }

    ///string extension

    String.prototype.trimLeft = function (str: string): string {
        var _this = this as string;
        var indx = _this.indexOf(str)
        if (indx == 0) return _this.substr(indx, str.length);
        else return str;
    }
    String.prototype.trimRight = function (str: string): string {
        var _this = this as string;
        var lindx = _this.lastIndexOf(str)
        if (lindx == _this.length - str.length) return _this.substr(lindx, str.length);
        else return str;
    }
    String.prototype.trimChars = function (str: string): string {
        var _this = this as string;
        var indx = _this.indexOf(str)
        if (indx == 0) return _this.substr(indx, str.length);
        else return str;
    }

    ///number extension

}