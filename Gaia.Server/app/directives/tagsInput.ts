
module Gaia.Directives {

    export class TagsInput {
        
        restrict: string = 'A';

        link(scope: ng.IScope, element, attributes): void {

            var binding = attributes.tagsInput;
            element.tagsInput({
                width: '100%',
                onChange: txt => {
                    scope.$eval(binding + ' = "' + element.get(0).value + '"');
                }
            });
        }
    }
}