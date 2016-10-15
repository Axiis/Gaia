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
        })(Domain = Luna.Domain || (Luna.Domain = {}));
    })(Luna = Axis.Luna || (Axis.Luna = {}));
})(Axis || (Axis = {}));
