var Gaia;
(function (Gaia) {
    var Utils;
    (function (Utils) {
        var StringPair = (function () {
            function StringPair() {
            }
            StringPair.prototype.toString = function (encoding) {
                //if(encoding == ...) //encode
                //else //default encoding
                return this.Key + ':' + this.Value + ';';
            };
            StringPair.ParseStringPairs = function (value, encoding) {
                var _this = this;
                encoding = encoding || Encoding.InlineCss;
                if (encoding == Encoding.InlineCss)
                    return value.split(';')
                        .map(function (v) {
                        var parts = v.split(':');
                        var sp = new StringPair();
                        sp.Key = _this.DecodeDelimiters(parts[0]).trim();
                        if (parts.length > 1)
                            sp.Value = _this.DecodeDelimiters(parts[1]).trim();
                        return sp;
                    })
                        .filter(function (pair) { return pair.Key != null && pair.Key != ''; });
                else
                    return [];
            };
            StringPair.EncodeDelimiters = function (value) {
                return value.replace(':', '##col').replace(';', '##scol');
            };
            StringPair.DecodeDelimiters = function (value) {
                return value.replace('##col', ':').replace('##scol', ';');
            };
            return StringPair;
        }());
        Utils.StringPair = StringPair;
        var Encoding;
        (function (Encoding) {
            Encoding[Encoding["InlineCss"] = 0] = "InlineCss";
        })(Encoding = Utils.Encoding || (Utils.Encoding = {}));
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
