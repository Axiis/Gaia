var Axis;
(function (Axis) {
    var Luna;
    (function (Luna) {
        var Domain;
        (function (Domain) {
            var Operation = (function () {
                function Operation(initArg) {
                    if (initArg)
                        initArg.copyTo(this);
                }
                return Operation;
            }());
            Domain.Operation = Operation;
            var BinaryData = (function () {
                function BinaryData(data) {
                    this.Name = null;
                    this.Mime = null;
                    this.Data = null; //B64 encoded string, or url/file-uri/etc
                    this.IsDataEmbeded = false;
                    if (typeof data === 'string') {
                        var dataUrl = data;
                        var parts = dataUrl.trimLeft("data:").split(';');
                        this.Mime = parts[0];
                        this.Data = parts[1].trimLeft("base64,");
                        this.IsDataEmbeded = true;
                        this.Name = 'data' + Gaia.Utils.MimeCodes.toExtension(this.Mime);
                    }
                    else if (typeof data === 'object') {
                        data.copyTo(this);
                    }
                }
                BinaryData.prototype.Extension = function () {
                    try {
                        return this.Name.substr(this.Name.lastIndexOf('.'));
                    }
                    catch (e) {
                        return null;
                    }
                };
                BinaryData.prototype.EmbededDataUrl = function () {
                    return "data:" + (this.Mime || 'application/octet-stream') + ";base64," + this.Data;
                };
                return BinaryData;
            }());
            Domain.BinaryData = BinaryData;
        })(Domain = Luna.Domain || (Luna.Domain = {}));
    })(Luna = Axis.Luna || (Axis.Luna = {}));
})(Axis || (Axis = {}));
//# sourceMappingURL=axis-luna-domain.js.map