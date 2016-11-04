

module Gaia.ViewModels.MarketPlace {

    export class MarketPlaceViewModel {

        currentState(): string {
            return this.state.current.name;
        }

        static $inject = ['#gaia.contextToolbar', '$state'];
        constructor(private contextToolbar: Gaia.Services.ContextToolbar, private state: ng.ui.IStateService) {
        }
    }

    export class CustomerViewModel {

    }

    export class MerchantViewModel {

    }

    export class ConfigureViewModel {

    }
}