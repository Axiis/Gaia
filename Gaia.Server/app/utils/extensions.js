var Gaia;
(function (Gaia) {
    var Extensions;
    (function (Extensions) {
        ///object extension
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
        ///number extension
        ///array extensions
        Array.prototype.paginate = function (sequence, pageIndex, pageSize) {
            if (pageIndex < 0 || pageSize < 1)
                throw 'invalid pagination arguments';
            var start = pageSize * pageIndex;
            return new Gaia.Utils.SequencePage(sequence.slice(start, (start + pageSize)), pageIndex, pageSize, sequence.length);
        };
    })(Extensions = Gaia.Extensions || (Gaia.Extensions = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=extensions.js.map