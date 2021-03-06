var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var MarketPlace;
        (function (MarketPlace) {
            MarketPlace.module = angular.module("gaiaMarketPlace", ['ui.router', 'ngSanitize', 'ngAnimate']);
            ///Gaia Directives
            MarketPlace.module.directive('#gaia.binaryData', Gaia.Directives.BinaryData);
            ///Gaia services
            MarketPlace.module.service('#gaia.profileService', Gaia.Services.ProfileService);
            MarketPlace.module.service('#gaia.accountsService', Gaia.Services.UserAccountService);
            MarketPlace.module.service('#gaia.marketPlaceService', Gaia.Services.MarketPlaceService);
            ///Pollux Services
            MarketPlace.module.service('#pollux.authentication', Pollux.Services.Authentication);
            ///Util Services
            MarketPlace.module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
            MarketPlace.module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);
            MarketPlace.module.service('#gaia.utils.notify', Gaia.Utils.Services.NotifyService);
            //context-toolbar service
            MarketPlace.module.service('#gaia.contextToolbar', Gaia.Services.ContextToolbar);
            ///ViewModels
            MarketPlace.module.controller('NavbarViewModel', Gaia.ViewModels.Shared.NavbarViewModel);
            MarketPlace.module.controller('MarketPlaceViewModel', Gaia.ViewModels.MarketPlace.MarketPlaceViewModel);
            MarketPlace.module.controller('CustomerViewModel', Gaia.ViewModels.MarketPlace.CustomerViewModel);
            MarketPlace.module.controller('MerchantViewModel', Gaia.ViewModels.MarketPlace.MerchantViewModel);
            MarketPlace.module.controller('ProductsViewModel', Gaia.ViewModels.MarketPlace.ProductsViewModel);
            MarketPlace.module.controller('ServicesViewModel', Gaia.ViewModels.MarketPlace.ServicesViewModel);
            MarketPlace.module.controller('OrdersViewModel', Gaia.ViewModels.MarketPlace.OrdersViewModel);
            MarketPlace.module.controller('ConfigureViewModel', Gaia.ViewModels.MarketPlace.ConfigureViewModel);
            //configure states
            MarketPlace.module.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/customer');
                $stateProvider
                    .state('customer', {
                    url: '/customer',
                    templateUrl: 'customer',
                    controller: 'CustomerViewModel',
                    controllerAs: 'vm'
                })
                    .state('merchant', {
                    url: '/merchant',
                    templateUrl: 'merchant',
                    controller: 'MerchantViewModel',
                    controllerAs: 'vm'
                })
                    .state('merchant.products', {
                    url: '/products',
                    templateUrl: 'products',
                    controller: 'ProductsViewModel',
                    controllerAs: 'vm'
                })
                    .state('merchant.services', {
                    url: '/services',
                    templateUrl: 'services',
                    controller: 'ServicesViewModel',
                    controllerAs: 'vm'
                })
                    .state('merchant.orders', {
                    url: '/orders',
                    templateUrl: 'orders',
                    controller: 'OrdersViewModel',
                    controllerAs: 'vm'
                })
                    .state('configure', {
                    url: '/configure',
                    templateUrl: 'configure',
                    controller: 'ConfigureViewModel',
                    controllerAs: 'vm'
                });
            });
        })(MarketPlace = App.MarketPlace || (App.MarketPlace = {}));
    })(App = Gaia.App || (Gaia.App = {}));
})(Gaia || (Gaia = {}));
