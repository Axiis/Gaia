
module Gaia.Directives {

    export class TagsInput {
        
        restrict: string = 'A';
        scope: any = {
            tagsInput: '='
        }

        link(scope: ng.IScope, element, attributes): void {
            var binding = attributes.tagsInput;

            element.tagsInput({
                width: '100%',
                onChange: txt => {
                    scope.$parent.$eval(binding + ' = "' + element.get(0).value + '"');
                }
            });

            //watch the binding
            scope.$parent.$watch(binding, () => {
                element.importTags(scope.$parent.$eval(binding));
            });
        }
    }
}