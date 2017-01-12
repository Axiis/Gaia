
module Gaia.Directives {

    export function BinaryData() {
        return {
            scope: {
                binaryData: "="
            },
            restrict: 'A',
            link: function (scope, element, attributes) {

                element.bind("change", (changeEvent) => {

                    var reader = new FileReader();
                    reader.onload = (loadEvent) => {
                        scope.$apply(() => {
                            var parts = reader.result.split(',');
                            scope.binaryData = Gaia.Utils.EncodedBinaryData.Create({
                                Size: changeEvent.target.files[0].size,
                                Data: parts[1],
                                Mime: changeEvent.target.files[0].type,
                                Name: changeEvent.target.files[0].name
                            });
                        });
                    }
                    if (changeEvent.target.files.length > 0 &&
                        changeEvent.target.files[0] instanceof Blob) reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }

}