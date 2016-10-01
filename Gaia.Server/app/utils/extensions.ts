
interface Func<O> { (): O; }
interface Func1<I, O> { (in1: I): O; }
interface Func2<I, I2, O> { (in1: I, in2: I2): O; }
interface Func3<I, I2, I3, O> { (in1: I, in2: I2, in3: I3): O; }
interface Func4<I, I2, I3, I4, O> { (in1: I, in2: I2, in3: I3, in4: I4): O; }
interface Func5<I, I2, I3, I4, I5, O> { (in1: I, in2: I2, in3: I3, in4: I4, in5: I5): O; }
interface Func6<I, I2, I3, I4, I5, I6, O> { (in1: I, in2: I2, in3: I3, in4: I4, in5: I5, in6: I6): O; }
interface Func7<I, I2, I3, I4, I5, I6, I7, O> { (in1: I, in2: I2, in3: I3, in4: I4, in5: I5, in6: I6, in7: I7): O; }
interface Func8<I, I2, I3, I4, I5, I6, I7, I8, O> { (in1: I, in2: I2, in3: I3, in4: I4, in5: I5, in6: I6, in7: I7, in8: I8): O; }
interface Func9<I, I2, I3, I4, I5, I6, I7, I8, I9, O> { (in1: I, in2: I2, in3: I3, in4: I4, in5: I5, in6: I6, in7: I7, in8: I8, in9: I9): O; }


interface Object {
    project<I, O>(f: Func1<I, O>): O;
    copyTo(target: any): any;
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
        value: function <I, O>(f: Func1<I, O>): O {
            if (typeof f === 'function') return f(this);
            else return null;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'copyTo', {
        value: function (target: any): any {
            //'use strict';
            // We must check against these specific cases.
            if (target === undefined || target === null) 
                throw new TypeError('Cannot convert undefined or null to object');

            for (var nextKey in this) {
                if (this.hasOwnProperty(nextKey))
                    target[nextKey] = this[nextKey];
            }
            return target;
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