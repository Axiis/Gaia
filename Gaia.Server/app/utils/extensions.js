var Gaia;
(function (Gaia) {
    var Extensions;
    (function (Extensions) {
        ///object extension
        Object.defineProperty(Object.prototype, 'copyTo', {
            value: function (target) {
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
        Object.defineProperty(Object.prototype, 'project', {
            value: function (f) {
                if (typeof f === 'function')
                    return f(this);
                else
                    return null;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(Object.prototype, 'properties', {
            value: function () {
                return Object.getOwnPropertyNames(this);
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(Object.prototype, 'propertyMaps', {
            value: function () {
                var _this = this;
                return this
                    .properties()
                    .map(function (_p) {
                    return {
                        Key: _p,
                        Value: _this[_p]
                    };
                });
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        ///string extension
        Object.defineProperty(String.prototype, 'trimLeft', {
            value: function (str) {
                var _this = this;
                var indx = _this.indexOf(str);
                if (indx == 0)
                    return _this.substr(indx, str.length);
                else
                    return str;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(String.prototype, 'trimRight', {
            value: function (str) {
                var _this = this;
                var lindx = _this.lastIndexOf(str);
                if (lindx == _this.length - str.length)
                    return _this.substr(lindx, str.length);
                else
                    return str;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(String.prototype, 'trimChars', {
            value: function (str) {
                var _this = this;
                return _this.trimLeft(str).trimRight(str);
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(String.prototype, 'startsWith', {
            value: function (str) {
                return this.indexOf(str) == 0;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(String.prototype, 'endsWith', {
            value: function (str) {
                var originalString = this;
                return originalString.lastIndexOf(str) == originalString.length - str.length;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        ///number extension
        ///array extensions
        Array.prototype.paginate = function (sequence, pageIndex, pageSize) {
            if (pageIndex < 0 || pageSize < 1)
                throw 'invalid pagination arguments';
            var start = pageSize * pageIndex;
            return new Gaia.Utils.SequencePage(sequence.slice(start, (start + pageSize)), pageIndex, pageSize, sequence.length);
        };
        Array.prototype.first = function (predicate) {
            var arr = this;
            if (predicate)
                arr = arr.filter(predicate);
            return arr[0];
        };
        Array.prototype.firstOrDefault = function (predicate) {
            try {
                return this.first(predicate);
            }
            catch (e) {
                return null;
            }
        };
        Array.prototype.group = function (keySelector) {
            var arr = this;
            var map = {};
            arr.forEach(function (_v) {
                var key = keySelector(_v);
                var cache = map[key.toString()] || (map[key.toString()] = []);
                cache.push(_v);
            });
            return map.propertyMaps().map(function (_map) {
                return {
                    Key: _map.Key,
                    Value: _map.Value
                };
            });
        };
    })(Extensions = Gaia.Extensions || (Gaia.Extensions = {}));
})(Gaia || (Gaia = {}));
