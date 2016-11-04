var Gaia;
(function (Gaia) {
    var Directives;
    (function (Directives) {
        var ContextToolbar = (function () {
            function ContextToolbar($compile, contextToolbarDelegate) {
                this.$compile = $compile;
                this.contextToolbarDelegate = contextToolbarDelegate;
                this.scope = {};
                contextToolbarDelegate.contextToolbar = this;
            }
            ContextToolbar.prototype.link = function (scope, element, attributes) {
                this._element = element;
                this._baseScope = scope;
                this._attributes = attributes;
            };
            ///Initializes the menu given, and returns the old menu
            ContextToolbar.prototype.pushMenu = function (menus) {
                var _this = this;
                if (Object.isNullOrUndefined(menus))
                    throw 'invalid menus supplied';
                else {
                    //delete the associated child scope
                    if (!Object.isNullOrUndefined(this._menus))
                        delete this._baseScope[this._menus.scopeAs];
                    //generate the html for the new menu list
                    var $element = menus.list
                        .map(function (_m) { return _m.toHtml(); })
                        .join() //concatenates the html strings
                        .project(function (sar) {
                        return $(document.createElement('div'))
                            .attr(_this._attributes) //add the attributes set on the directive element
                            .html('<div class="input-group">' + sar + '</div>');
                    });
                    //compile the generated elements
                    var link = this.$compile($element);
                    //associate the child scope
                    this._baseScope[menus.scopeAs] = menus.scope;
                    //link and append the newly generated menu elements
                    var linkedElements = link(this._baseScope);
                    this._element.empty().append(linkedElements);
                    //replace the menu
                    var oldMenus = this._menus;
                    this._menus = menus;
                    return oldMenus;
                }
            };
            return ContextToolbar;
        }());
        Directives.ContextToolbar = ContextToolbar;
    })(Directives = Gaia.Directives || (Gaia.Directives = {}));
})(Gaia || (Gaia = {}));
