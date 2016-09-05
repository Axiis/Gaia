
interface Func<I, O> {
    (_in1: any): O;
}

interface Object {
    project<I, O>(f: Func<I, O>): O
}

interface String {
    trimLeft(str: string): string;
    trimRight(str: string): string;
    trimChars(str: string): string;
}

interface Array<T>{
    paginate<Data>(sequence: Array<Data>, pageIndex: number, pageSize: number): Gaia.Utils.SequencePage<Data>;
}

module Gaia.Extensions {

    ///object extension

    Object.defineProperty(Object.prototype, 'project', {
        value: function <I, O>(f: Func<I, O>): O{
            if (typeof f === 'function') return f(this);
            else return null; 
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    ///string extension

    Object.defineProperty(String.prototype, 'trimLeft', {
        value: function (str: string): string {
            var _this = this as string;
            var indx = _this.indexOf(str)
            if (indx == 0) return _this.substr(indx, str.length);
            else return str;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(String.prototype, 'trimRight', {
        value: function (str: string): string {
            var _this = this as string;
            var lindx = _this.lastIndexOf(str)
            if (lindx == _this.length - str.length) return _this.substr(lindx, str.length);
            else return str;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(String.prototype, 'trimChars', {
        value: function (str: string): string {
            var _this = this as string;
            return _this.trimLeft(str).trimRight(str);
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    ///number extension


    ///array extensions

    Array.prototype.paginate = function <Data>(sequence: Array<Data>, pageIndex: number, pageSize: number): Gaia.Utils.SequencePage<Data> {

        if (pageIndex < 0 || pageSize < 1) throw 'invalid pagination arguments';

        var start = pageSize * pageIndex;
        return new Gaia.Utils.SequencePage<Data>(
            sequence.slice(start, (start + pageSize)),
            pageIndex,
            pageSize,
            sequence.length);
    }

}