var Gaia;
(function (Gaia) {
    var Directives;
    (function (Directives) {
        var TagsInput = (function () {
            function TagsInput() {
                this.restrict = 'A';
            }
            TagsInput.prototype.link = function (scope, element, attributes) {
                var binding = attributes.tagsInput;
                element.tagsInput({
                    width: '100%',
                    onChange: function (txt) {
                        //scope.$eval(binding + ' = "' + element.get(0).value + '"');
                        scope['tagsInput'] = element.get(0).value;
                    }
                });
            };
            return TagsInput;
        }());
        Directives.TagsInput = TagsInput;
    })(Directives = Gaia.Directives || (Gaia.Directives = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=tagsInput.js.map