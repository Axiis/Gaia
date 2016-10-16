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
                function BinaryData(dataUrl) {
                    this.Name = null;
                    this.Address = null;
                    this.Mime = null;
                    this.Data = null; //B64 encoded string
                    if (dataUrl) {
                        var parts = dataUrl.trimLeft("data:").split(';');
                        this.Mime = parts[0];
                        this.Data = parts[1].trimLeft("base64,");
                    }
                }
                BinaryData.prototype.Extension = function () {
                    try {
                        return this.Name.substr(this.Name.lastIndexOf('.') + 1);
                    }
                    catch (e) {
                        return null;
                    }
                };
                BinaryData.prototype.DataUrl = function () {
                    return "data:" + (this.Mime || 'application/octet-stream') + ";base64," + this.Data;
                };
                return BinaryData;
            }());
            Domain.BinaryData = BinaryData;
        })(Domain = Luna.Domain || (Luna.Domain = {}));
    })(Luna = Axis.Luna || (Axis.Luna = {}));
})(Axis || (Axis = {}));
