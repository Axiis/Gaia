var Gaia;
(function (Gaia) {
    var Utils;
    (function (Utils) {
        //mime codes
        var MimeMap = (function () {
            function MimeMap() {
            }
            MimeMap.prototype.toMimeCode = function (extension) {
                var _this = this;
                return Utils.MimeCodes.keys().filter(function (_k) { return _k == extension; }).map(function (_k) { return _this[_k]; }).firstOrDefault();
            };
            MimeMap.prototype.toExtension = function (mimeCode) {
                if (!Object.isNullOrUndefined(mimeCode))
                    return (Utils.MimeCodes)
                        .keyValuePairs()
                        .filter(function (_kvp) { return _kvp.Value == mimeCode; })
                        .firstOrDefault()
                        .Key;
                else
                    return null;
            };
            MimeMap.prototype.toMimeMaps = function () {
                return (Utils.MimeCodes)
                    .keyValuePairs()
                    .filter(function (_kvp) { return _kvp.Key.startsWith('.'); });
            };
            return MimeMap;
        }());
        Utils.MimeMap = MimeMap;
        ;
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
