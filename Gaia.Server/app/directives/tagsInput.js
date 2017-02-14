var Gaia;
(function (Gaia) {
    var Directives;
    (function (Directives) {
        var TagsInput = (function () {
            function TagsInput() {
                this.restrict = 'A';
                this.scope = {
                    tagsInput: '='
                };
            }
            TagsInput.prototype.link = function (scope, element, attributes) {
                var binding = attributes.tagsInput;
                element.tagsInput({
                    width: '100%',
                    onChange: function (txt) {
                        scope.$parent.$eval(binding + ' = "' + element.get(0).value + '"');
                    }
                });
                //watch the binding
                scope.$parent.$watch(binding, function () {
                    element.importTags(scope.$parent.$eval(binding));
                });
            };
            return TagsInput;
        }());
        Directives.TagsInput = TagsInput;
    })(Directives = Gaia.Directives || (Gaia.Directives = {}));
})(Gaia || (Gaia = {}));
