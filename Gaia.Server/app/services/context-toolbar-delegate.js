var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Gaia;
(function (Gaia) {
    var Services;
    (function (Services) {
        var ContextToolbar = (function () {
            function ContextToolbar($compile) {
                this.$compile = $compile;
                //get the element
                this._element = angular.element('context-toolbar');
                //get the attributes
                this._attributes = {};
                var elt = this._element[0];
                for (var cnt = 0; cnt < elt.attributes.length; cnt++) {
                    var attr = elt.attributes[cnt];
                    this._attributes[attr.nodeName] = attr.value;
                }
            }
            ContextToolbar.prototype.pushMenu = function (menus) {
                var _this = this;
                if (Object.isNullOrUndefined(menus))
                    throw 'invalid menus supplied';
                else {
                    //generate the html for the new menu list
                    var $element = menus.list
                        .map(function (_m) { return _m.toElement(); })
                        .project(function (sar) {
                        var inner = $(document.createElement('div'))
                            .attr('class', 'input-group');
                        sar.forEach(function (_jq) { return inner.append(_jq); });
                        return $(document.createElement('div'))
                            .attr(_this._attributes) //add the attributes set on the directive element
                            .append(inner);
                    });
                    //compile the generated elements
                    var link = this.$compile($element);
                    //link and append the newly generated menu elements
                    var linkedElements = link(menus.scope);
                    this._element.empty().append(linkedElements);
                    //replace the menu
                    var oldMenus = this._menus;
                    this._menus = menus;
                    return oldMenus;
                }
            };
            ContextToolbar.$inject = ['$compile'];
            return ContextToolbar;
        }());
        Services.ContextToolbar = ContextToolbar;
        //module merging to simulate nested classes!
        var ContextToolbar;
        (function (ContextToolbar) {
            var ButtonMenu = (function () {
                function ButtonMenu() {
                }
                ButtonMenu.prototype.toElement = function () {
                    return $(document.createElement('button'))
                        .addClass('btn btn-default')
                        .append(this.$$content || '')
                        .attr(this.copyTo({}, this.keys().filter(function (_k) { return _k.startsWith('$$'); })));
                };
                return ButtonMenu;
            }());
            ContextToolbar.ButtonMenu = ButtonMenu;
            var ButtonDropdown = (function (_super) {
                __extends(ButtonDropdown, _super);
                function ButtonDropdown() {
                    _super.apply(this, arguments);
                }
                ButtonDropdown.prototype.toElement = function () {
                    return $(document.createElement('button'))
                        .addClass('btn btn-default dropdown-toggle')
                        .data('toggle', 'dropdown')
                        .append(this.$$content || '')
                        .attr(this.copyTo({}, this.keys().filter(function (_k) { return _k.startsWith('$$'); })))
                        .add(this.$$dropdown);
                };
                return ButtonDropdown;
            }(ButtonMenu));
            ContextToolbar.ButtonDropdown = ButtonDropdown;
            var ButtonGroup = (function () {
                function ButtonGroup() {
                    this.buttonList = [];
                }
                ButtonGroup.prototype.toElement = function () {
                    var outer = $(document.createElement('div')).addClass('input-group-btn').attr(this);
                    this.buttonList.forEach(function (_b) { return outer.append(_b.toElement()); });
                    return outer;
                };
                return ButtonGroup;
            }());
            ContextToolbar.ButtonGroup = ButtonGroup;
            var TextInputMenu = (function () {
                function TextInputMenu() {
                }
                TextInputMenu.prototype.toElement = function () {
                    return $(document.createElement('input')).addClass('form-control').attr(this);
                };
                return TextInputMenu;
            }());
            ContextToolbar.TextInputMenu = TextInputMenu;
            var MenuList = (function () {
                function MenuList(scope, menuList) {
                    this._menus = [];
                    if (Object.isNullOrUndefined(scope))
                        throw 'invalid arguments';
                    this._scope = scope;
                    if (!Object.isNullOrUndefined(menuList))
                        this.list = menuList;
                }
                Object.defineProperty(MenuList.prototype, "list", {
                    get: function () {
                        return this._menus;
                    },
                    set: function (value) {
                        if (Object.isNullOrUndefined(value))
                            throw 'invalid menu array supplied';
                        this._menus.clear();
                        (_a = this._menus).push.apply(_a, value);
                        var _a;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MenuList.prototype, "scope", {
                    get: function () {
                        return this._scope;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MenuList;
            }());
            ContextToolbar.MenuList = MenuList;
        })(ContextToolbar = Services.ContextToolbar || (Services.ContextToolbar = {}));
    })(Services = Gaia.Services || (Gaia.Services = {}));
})(Gaia || (Gaia = {}));
