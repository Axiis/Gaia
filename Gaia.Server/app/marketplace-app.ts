
module Gaia.App.MarketPlace {

    export const module = angular.module("gaiaMarketPlace", ['ui.router', 'ngSanitize', 'ngAnimate']);

    ///Gaia Directives
    module.directive('#gaia.binaryData', Gaia.Directives.BinaryData);

    ///Gaia services
    module.service('#gaia.profileService', Gaia.Services.ProfileService);
    module.service('#gaia.accountsService', Gaia.Services.UserAccountService);

    ///Pollux Services
    module.service('#pollux.authentication', Pollux.Services.Authentication);

    ///Util Services
    module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
    module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);
    module.service('#gaia.utils.notify', Gaia.Utils.Services.NotifyService);

    //context-toolbar service
    module.service('#gaia.contextToolbar', Gaia.Services.ContextToolbar);
    

    ///ViewModels
    module.controller('NavbarViewModel', Gaia.ViewModels.Shared.NavbarViewModel);
    module.controller('MarketPlaceViewModel', Gaia.ViewModels.MarketPlace.MarketPlaceViewModel);
    module.controller('CustomerViewModel', Gaia.ViewModels.MarketPlace.CustomerViewModel);
    module.controller('MerchantViewModel', Gaia.ViewModels.MarketPlace.MerchantViewModel);
    module.controller('ConfigureViewModel', Gaia.ViewModels.MarketPlace.ConfigureViewModel);


    //configure states
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/customer')

        $stateProvider
            .state('customer', {
                url: '/customer',
                templateUrl: 'customer', //<-- /view-server/secured/market-place/customer
                controller: 'CustomerViewModel',
                controllerAs: 'vm'
            })
            .state('merchant', {
                url: '/merchant',
                templateUrl: 'merchant', //<-- /view-server/secured/market-place/merchant
                controller: 'MerchantViewModel',
                controllerAs: 'vm'
            })
            .state('configure', {
                url: '/configure',
                templateUrl: 'configure', //<-- /view-server/secured/market-place/configure
                controller: 'ConfigureViewModel',
                controllerAs: 'vm'
            });
    });

}