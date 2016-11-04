var Gaia;
(function (Gaia) {
    var Directives;
    (function (Directives) {
        function BinaryData() {
            return {
                scope: {
                    binaryData: "="
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        var reader = new FileReader();
                        reader.onload = function (loadEvent) {
                            scope.$apply(function () {
                                var parts = reader.result.split(',');
                                scope.binaryData = new Axis.Luna.Domain.BinaryData({
                                    Size: changeEvent.target.files[0].size,
                                    Mime: changeEvent.target.files[0].type,
                                    Name: changeEvent.target.files[0].name,
                                    IsDataEmbeded: true,
                                    Data: parts[1]
                                });
                            });
                        };
                        if (changeEvent.target.files.length > 0 &&
                            changeEvent.target.files[0] instanceof Blob)
                            reader.readAsDataURL(changeEvent.target.files[0]);
                    });
                }
            };
        }
        Directives.BinaryData = BinaryData;
    })(Directives = Gaia.Directives || (Gaia.Directives = {}));
})(Gaia || (Gaia = {}));
