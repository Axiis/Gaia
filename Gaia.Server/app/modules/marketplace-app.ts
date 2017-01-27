
module Gaia.App.MarketPlace {

    export const module = angular.module("gaiaMarketPlace", ['ui.router', 'ngSanitize', 'ngAnimate']);

    ///Gaia Directives
    module.directive('binaryData', Gaia.Directives.BinaryData);
    module.directive('tagsInput', () => new Gaia.Directives.TagsInput());
    module.directive('enumOptions', () => new Gaia.Directives.EnumOptions());
    module.directive('smallProductCard', () => new Gaia.Directives.MarketPlace.SmallProductCard());
    module.directive('largeProductCard', () => new Gaia.Directives.MarketPlace.LargeProductCard());

    ///Gaia services
    module.service('#gaia.profileService', Gaia.Services.ProfileService);
    module.service('#gaia.accountsService', Gaia.Services.UserAccountService);
    module.service('#gaia.marketPlaceService', Gaia.Services.MarketPlaceService);

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
    module.controller('PreferencesViewModel', Gaia.ViewModels.MarketPlace.PreferencesViewModel);

    module.controller('CustomerViewModel', Gaia.ViewModels.MarketPlace.CustomerViewModel);
    module.controller('CustomerProductsViewModel', Gaia.ViewModels.MarketPlace.CustomerProductsViewModel);
    module.controller('CustomerProductDetailsViewModel', Gaia.ViewModels.MarketPlace.CustomerProductDetailsViewModel);
    module.controller('CustomerCartViewModel', Gaia.ViewModels.MarketPlace.CustomerCartViewModel);
    module.controller('CustomerCheckoutViewModel', Gaia.ViewModels.MarketPlace.CustomerCheckoutViewModel);
    module.controller('CustomerOrderHistoryViewModel', Gaia.ViewModels.MarketPlace.CustomerOrderHistoryViewModel);
    module.controller('CustomerInvoiceViewModel', Gaia.ViewModels.MarketPlace.CustomerInvoiceViewModel);

    module.controller('SmallProductCardController', Gaia.Directives.MarketPlace.SmallProductCardController);
    module.controller('LargeProductCardController', Gaia.Directives.MarketPlace.LargeProductCardController);

    module.controller('MerchantViewModel', Gaia.ViewModels.MarketPlace.MerchantViewModel);
    module.controller('MerchantProductsViewModel', Gaia.ViewModels.MarketPlace.MerchantProductsViewModel);
    module.controller('MerchantServicesViewModel', Gaia.ViewModels.MarketPlace.MerchantServicesViewModel);
    module.controller('MerchantOrdersViewModel', Gaia.ViewModels.MarketPlace.MerchantOrdersViewModel);


    //configure states
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/customer')

        $stateProvider

            ///Customer
            .state('customer', {
                url: '/customer',
                templateUrl: 'customer', //<-- /view-server/secured/market-place/customer
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


            ///Merchant
            .state('merchant', {
                url: '/merchant',
                templateUrl: 'merchant', //<-- /view-server/secured/market-place/merchant
                controller: 'MerchantViewModel',
                controllerAs: 'vm'
            })
            .state('merchant.products', {
                url: '/products',
                templateUrl: 'products', //<-- /view-server/secured/market-place/products
                controller: 'MerchantProductsViewModel',
                controllerAs: 'vm'
            })
            .state('merchant.services', {
                url: '/services',
                templateUrl: 'services', //<-- /view-server/secured/market-place/services
                controller: 'MerchantServicesViewModel',
                controllerAs: 'vm'
            })
            .state('merchant.orders', {
                url: '/orders',
                templateUrl: 'orders', //<-- /view-server/secured/market-place/orders
                controller: 'MerchantOrdersViewModel',
                controllerAs: 'vm'
            })
            .state('preferences', {
                url: '/preferences',
                templateUrl: 'preferences', //<-- /view-server/secured/market-place/preferences
                controller: 'PreferencesViewModel',
                controllerAs: 'vm'
            });
    });

}