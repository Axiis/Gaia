

module Gaia.Services {

    export class ContextToolbar {

        private _element: JQuery;
        private _menus: ContextToolbar.MenuList;
        private _attributes: any;


        pushMenu(menus: Gaia.Services.ContextToolbar.MenuList): Gaia.Services.ContextToolbar.MenuList {

            if (this._element.length <= 0) return null;
            if (Object.isNullOrUndefined(menus)) throw 'invalid menus supplied';

            else {

                //generate the html for the new menu list
                var $element = menus.list
                    .map(_m => _m.toElement())
                    .project((sar: JQuery[]) => {

                        var inner = $(document.createElement('div'))
                            .attr('class', 'input-group');
                        sar.forEach(_jq => inner.append(_jq));

                        return $(document.createElement('div'))
                            .attr(this._attributes as Object) //add the attributes set on the directive element
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
        }

        static $inject = ['$compile'];
        constructor(private $compile: ng.ICompileService) {

            //get the element
            this._element = angular.element('context-toolbar');

            if (this._element.length > 0) {

                //get the attributes
                this._attributes = {};
                var elt = this._element[0];
                for (var cnt = 0; cnt < elt.attributes.length; cnt++) {
                    var attr = elt.attributes[cnt];
                    this._attributes[attr.nodeName] = attr.value;
                }
            }
        }
    }


    //module merging to simulate nested classes!
    export module ContextToolbar {

        export interface IContextMenu {
            toElement(): JQuery;
        }

        export class ButtonMenu implements IContextMenu {
            $$content: JQuery;

            toElement(): JQuery {
                return $(document.createElement('button'))
                    .addClass('btn btn-default')
                    .append(this.$$content || '')
                    .attr(this.copyTo({}, this.keys().filter(_k => _k.startsWith('$$'))) as Object);
            }
        }

        export class ButtonDropdown extends ButtonMenu {
            $$dropdown: JQuery;

            toElement(): JQuery {
                return $(document.createElement('button'))
                    .addClass('btn btn-default dropdown-toggle')
                    .data('toggle', 'dropdown')
                    .append(this.$$content || '')
                    .attr(this.copyTo({}, this.keys().filter(_k => _k.startsWith('$$'))) as Object)
                    .add(this.$$dropdown);
            }
        }

        export class ButtonGroup implements IContextMenu {

            buttonList: ButtonMenu[] = [];

            toElement(): JQuery {
                var outer = $(document.createElement('div')).addClass('input-group-btn').attr(this);
                this.buttonList.forEach(_b => outer.append(_b.toElement()));
                return outer;
            }
        }

        export class TextInputMenu implements IContextMenu {
            toElement(): JQuery {
                return $(document.createElement('input')).addClass('form-control').attr(this);
            }
        }

        export class MenuList {

            private _menus: IContextMenu[] = [];
            get list(): IContextMenu[] {
                return this._menus;
            }
            set list(value: IContextMenu[]) {
                if (Object.isNullOrUndefined(value)) throw 'invalid menu array supplied';

                this._menus.clear();
                this._menus.push(...value);
            }

            private _scope: any;
            get scope(): any {
                return this._scope;
            }

            constructor(scope: any, menuList?: IContextMenu[]) {
                if (Object.isNullOrUndefined(scope)) throw 'invalid arguments';

                this._scope = scope;
                if (!Object.isNullOrUndefined(menuList)) this.list = menuList;
            }
        }
    }

}