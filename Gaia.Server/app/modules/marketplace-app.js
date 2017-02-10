var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var MarketPlace;
        (function (MarketPlace) {
            MarketPlace.module = angular.module("gaiaMarketPlace", ['ui.router', 'ngSanitize', 'ngAnimate']);
            ///Gaia Directives
            MarketPlace.module.directive('binaryData', Gaia.Directives.BinaryData);
            MarketPlace.module.directive('tagsInput', function () { return new Gaia.Directives.TagsInput(); });
            MarketPlace.module.directive('enumOptions', function () { return new Gaia.Directives.EnumOptions(); });
            MarketPlace.module.directive('ringLoader', function () { return new Gaia.Directives.RingLoader(); });
            MarketPlace.module.directive('boxLoader', function () { return new Gaia.Directives.BoxLoader(); });
            MarketPlace.module.directive('smallProductCard', ['#gaia.marketPlaceService', '#gaia.utils.notify', '$compile',
                function (mp, n, $compile) { return new Gaia.Directives.MarketPlace.SmallProductCard(mp, n, $compile); }]);
            MarketPlace.module.directive('largeProductCard', ['#gaia.marketPlaceService', '#gaia.utils.notify', '$compile',
                function (mp, n, $compile) { return new Gaia.Directives.MarketPlace.LargeProductCard(mp, n, $compile); }]);
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
            MarketPlace.module.controller('PreferencesViewModel', Gaia.ViewModels.MarketPlace.PreferencesViewModel);
            MarketPlace.module.controller('CustomerViewModel', Gaia.ViewModels.MarketPlace.CustomerViewModel);
            MarketPlace.module.controller('CustomerProductsViewModel', Gaia.ViewModels.MarketPlace.CustomerProductsViewModel);
            MarketPlace.module.controller('CustomerProductDetailsViewModel', Gaia.ViewModels.MarketPlace.CustomerProductDetailsViewModel);
            MarketPlace.module.controller('CustomerCartViewModel', Gaia.ViewModels.MarketPlace.CustomerCartViewModel);
            MarketPlace.module.controller('CustomerCheckoutViewModel', Gaia.ViewModels.MarketPlace.CustomerCheckoutViewModel);
            MarketPlace.module.controller('CustomerOrderHistoryViewModel', Gaia.ViewModels.MarketPlace.CustomerOrderHistoryViewModel);
            MarketPlace.module.controller('CustomerInvoiceViewModel', Gaia.ViewModels.MarketPlace.CustomerInvoiceViewModel);
            MarketPlace.module.controller('SmallProductCardController', Gaia.Directives.MarketPlace.SmallProductCard);
            MarketPlace.module.controller('LargeProductCardController', Gaia.Directives.MarketPlace.LargeProductCard);
            MarketPlace.module.controller('MerchantViewModel', Gaia.ViewModels.MarketPlace.MerchantViewModel);
            MarketPlace.module.controller('MerchantProductsViewModel', Gaia.ViewModels.MarketPlace.MerchantProductsViewModel);
            MarketPlace.module.controller('MerchantServicesViewModel', Gaia.ViewModels.MarketPlace.MerchantServicesViewModel);
            MarketPlace.module.controller('MerchantOrdersViewModel', Gaia.ViewModels.MarketPlace.MerchantOrdersViewModel);
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
                    .state('customer.products', {
                    url: '/products',
                    templateUrl: '/view-server/secured/market-place/customer-products',
                    controller: 'CustomerProductsViewModel',
                    controllerAs: 'vm'
                })
                    .state('customer.details', {
                    url: '/details',
                    templateUrl: '/view-server/secured/market-place/customer-product-details',
                    controller: 'CustomerProductDetailsViewModel',
                    controllerAs: 'vm'
                })
                    .state('customer.cart', {
                    url: '/cart',
                    templateUrl: '/view-server/secured/market-place/cart',
                    controller: 'CustomerCartViewModel',
                    controllerAs: 'vm'
                })
                    .state('customer.checkout', {
                    url: '/checkout',
                    templateUrl: '/view-server/secured/market-place/checkout',
                    controller: 'CustomerCheckoutViewModel',
                    controllerAs: 'vm'
                })
                    .state('customer.orderhistory', {
                    url: '/order-history',
                    templateUrl: '/view-server/secured/market-place/order-history',
                    controller: 'CustomerOrderHistoryViewModel',
                    controllerAs: 'vm'
                })
                    .state('customer.invoice', {
                    url: '/invoice',
                    templateUrl: '/view-server/secured/market-place/invoice',
                    controller: 'CustomerInvoiceViewModel',
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
                    controller: 'MerchantProductsViewModel',
                    controllerAs: 'vm'
                })
                    .state('merchant.services', {
                    url: '/services',
                    templateUrl: 'services',
                    controller: 'MerchantServicesViewModel',
                    controllerAs: 'vm'
                })
                    .state('merchant.orders', {
                    url: '/orders',
                    templateUrl: 'orders',
                    controller: 'MerchantOrdersViewModel',
                    controllerAs: 'vm'
                })
                    .state('preferences', {
                    url: '/preferences',
                    templateUrl: 'preferences',
                    controller: 'PreferencesViewModel',
                    controllerAs: 'vm'
                });
            });
        })(MarketPlace = App.MarketPlace || (App.MarketPlace = {}));
    })(App = Gaia.App || (Gaia.App = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=marketplace-app.js.map