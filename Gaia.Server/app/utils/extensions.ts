
interface Func0<> { () }
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
    copyTo(target: any, properties?:string[]): any;
    project<I, O>(f: Func1<I, O>): O;
    properties(): Array<string>;
    keys(): Array<string>;
    keyValuePairs(): Array<Gaia.Utils.Map<string, any>>;
    propertyMaps(): Array<Gaia.Utils.Map<string, any>>;
}

interface String {
    trimLeft(str: string): string;
    trimRight(str: string): string;
    trimChars(str: string): string;

    startsWith(str: string): boolean;
    endsWith(str: string): boolean;
}


interface Array<T> {
    paginate(sequence: Array<T>, pageIndex: number, pageSize: number): Gaia.Utils.SequencePage<T>;
    first(predicate?: Func1<T, boolean>): T;
    firstOrDefault(predicate?: Func1<T, boolean>): T;
    group<K>(keySelector: Func1<T, K>): Array<Gaia.Utils.Map<K, Array<T>>>;
}

module Gaia.Extensions {

    ///object extension

    Object.defineProperty(Object.prototype, 'copyTo', {
        value: function (target: any, properties?: string[]): any {
            //'use strict';
            // We must check against these specific cases.
            if (target === undefined || target === null)
                throw new TypeError('Cannot convert undefined or null to object');

            if (properties) {
                properties.forEach(nextKey => {
                    if (this.hasOwnProperty(nextKey))
                        target[nextKey] = this[nextKey];
                });
            }
            else {
                for (var nextKey in this) {
                    if (this.hasOwnProperty(nextKey))
                        target[nextKey] = this[nextKey];
                }
            }
            return target;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'project', {
        value: function <I, O>(f: Func1<I, O>): O {
            if (typeof f === 'function') return f(this);
            else return null;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'properties', {
        value: function (): Array<string> {
            return Object.getOwnPropertyNames(this);
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'keys', {
        value: function (): Array<string> {
            return Object.keys(this);
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'keyValuePairs', {
        value: function (): Array<Utils.Map<string, any>> {
            return Object.keys(this).map(_k => {
                return {
                    Key: _k,
                    Value: this[_k]
                } as Utils.Map<string, any>
            });
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'propertyMaps', {
        value: function (): Array<Gaia.Utils.Map<string, any>> {
            return (this as Object)
                .properties()
                .map(_p => {
                    return {
                        Key: _p,
                        Value: this[_p]
                    } as Gaia.Utils.Map<string, any>;
                });
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


    Object.defineProperty(String.prototype, 'startsWith', {
        value: function (str: string): boolean {
            return (this as string).indexOf(str) == 0;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (str: string): boolean {
            var originalString = this as string;
            return originalString.lastIndexOf(str) == originalString.length - str.length;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });

    ///number extension


    ///array extensions

    Array.prototype.paginate = function<Data>(sequence: Array<Data>, pageIndex: number, pageSize: number): Gaia.Utils.SequencePage<Data> {

        if (pageIndex < 0 || pageSize < 1) throw 'invalid pagination arguments';

        var start = pageSize * pageIndex;
        return new Gaia.Utils.SequencePage<Data>(
            sequence.slice(start, (start + pageSize)),
            pageIndex,
            pageSize,
            sequence.length);
    }

    Array.prototype.first = function <Data>(predicate?: Func1<Data, boolean>): Data {
        var arr = this as Array<Data>;
        if (predicate) arr = arr.filter(predicate);
        return arr[0]; //intentionally throw an exception if the array is empty
    }

    Array.prototype.firstOrDefault = function <Data>(predicate?: Func1<Data, boolean>): Data {
        try {
            return (this as Array<Data>).first(predicate);
        }
        catch (e) {
            return null;
        }
    }

    Array.prototype.group = function <K, V>(keySelector: Func1<V, K>): Array<Gaia.Utils.Map<K, Array<V>>> {

        var arr = this as Array<V>;
        var map = {};
        arr.forEach(_v => {
            var key = keySelector(_v);
            var cache: Array<V> = map[key.toString()] || (map[key.toString()] = []);
            cache.push(_v);
        });

        return map.propertyMaps().map(_map => {
            return {
                Key: (_map.Key as any) as K,
                Value: _map.Value as Array<V>
            } as Gaia.Utils.Map<K, Array<V>>;
        });
    }

}