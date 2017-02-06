

module Gaia.ViewModels.MarketPlace {

    export class MarketPlaceViewModel {

        get accessProfiles(): string[] {
            return this.domModels.simpleModel.AccessProfiles.split(',');
        }
        get isMerchantAccount(): boolean {
            return this.accessProfiles.contains(Gaia.Utils.ServiceProvierAccountProfile);
        }
        get isFarmerAccount(): boolean {
            return this.accessProfiles.contains(Gaia.Utils.FarmerAccountProfile);
        }

        isMerchantActive(): boolean {
            return this.state.current.name.startsWith('merchant');
        }
        isPreferencesActive(): boolean {
            return this.state.current.name.startsWith('configure');
        }
        isCustomerActive(): boolean {
            return this.state.current.name.startsWith('customer');
        }

        static $inject = ['#gaia.contextToolbar', '#gaia.utils.domModel', '$state'];
        constructor(private contextToolbar: Gaia.Services.ContextToolbar,
            private domModels: Gaia.Utils.Services.DomModelService,
            private state: ng.ui.IStateService) {
        }
    }

    export class PreferencesViewModel {

    }
}


//Merchant
module Gaia.ViewModels.MarketPlace {

    export class MerchantViewModel {

        get accessProfiles(): string[] {
            return this.domModels.simpleModel.AccessProfiles.split(',');
        }
        get isMerchantAccount(): boolean {
            return this.accessProfiles.contains(Gaia.Utils.ServiceProvierAccountProfile);
        }
        get isFarmerAccount(): boolean {
            return this.accessProfiles.contains(Gaia.Utils.FarmerAccountProfile);
        }


        isServicesActive(): boolean {
            return this.$state.current.name == 'merchant.services';
        }
        isOrdersActive(): boolean {
            return this.$state.current.name == 'merchant.orders';
        }
        isProductsActive(): boolean {
            return this.$state.current.name == 'merchant.products';
        }

        static $inject = ['$state', '#gaia.utils.domModel'];
        constructor(private $state: ng.ui.IStateService, private domModels: Gaia.Utils.Services.DomModelService) {
            if (this.$state.current.name == 'merchant') this.$state.go('merchant.services');
        }
    }

    export class MerchantProductsViewModel {

        isSearching: boolean = false;
        isListingProducts: boolean = true;
        isModifyingProduct: boolean = false;
        isPersistingProduct: boolean = false;

        currentProduct: Domain.Product = null;
        currentListingPage: number = 0;
        pageSize: number = 30;
        searchString: string = null;
        products: Utils.SequencePage<Domain.Product> = new Utils.SequencePage<Domain.Product>([], 0, 1, 0);

        switchState(state: any) {
            if (!Object.isNullOrUndefined(state)) {
                this.isSearching = this.isListingProducts = this.isModifyingProduct = this.isPersistingProduct = false;
                (state as Object).keyValuePairs().forEach(kvp => this[kvp.Key] = kvp.Value);
            }
        }

        isCurrentProductNascent(): boolean {
            if (Object.isNullOrUndefined(this.currentProduct)) return false;
            else if (this.currentProduct['$nascent'] == true) return true;
            else return false;
        }

        refreshProducts() {
            this.currentListingPage = 0;
            this.searchString = null;
            this.listProducts(this.currentListingPage, this.searchString);
        }

        listProducts(pageIndex: number, search: string) {
            this.isSearching = true;
            this.marketplace.findMerchantProducts(search, this.pageSize, pageIndex)
                .then(opr => {
                    this.products = opr.Result
                    this.isSearching = false;
                    this.currentListingPage = pageIndex;
                }, err => {
                    this.products = new Utils.SequencePage<Domain.Product>([], 0, 1, 0);
                    this.isSearching = false;
                    return this.$q.defer().reject();
                });
        }

        newProduct(init?: Func1<Domain.Product, void>): Domain.Product {
            var p = new Domain.Product();
            if (!Object.isNullOrUndefined(init)) init(p);
            return p;
        }

        addAndModify() {
            this.modifyProduct(this.newProduct(s => {
                s['$nascent'] = true;
            }));
        }

        modifyProduct(product: Domain.Product) {
            this.isListingProducts = this.isSearching = false;
            this.isModifyingProduct = true;
            this.currentProduct = product;
        }

        search() {
            this.listProducts(0, this.searchString);
        }

        persistCurrentProduct() {
            if (!Object.isNullOrUndefined(this.currentProduct) && !this.isPersistingProduct) {
                this.isPersistingProduct = true;

                if (this.currentProduct['$nascent']) {
                    this.marketplace
                        .addProduct(this.currentProduct)
                        .then(opr => {
                            this.currentProduct.EntityId = opr.Result;
                            this.currentProduct.CreatedBy = this.domModel.simpleModel.UserId;
                            this.notify.success('the Product was persisted successfully!');
                            this.isPersistingProduct = false;

                            delete this.currentProduct['$nascent'];
                            this.products.Page.push(this.currentProduct);

                            this.switchState({ isListingProducts: true, currentProduct: null });
                        }, err => {
                            this.notify.error(err.data.Message, 'Error!');
                            this.isPersistingProduct = false;
                            return this.$q.reject(err);
                        });
                }
                else {
                    this.marketplace
                        .modifyProduct(this.currentProduct)
                        .then(opr => {
                            this.notify.success('the Product was persisted successfully!');
                            this.isPersistingProduct = false;

                            this.switchState({ isListingProducts: true, currentProduct: null });
                        }, err => {
                            this.notify.error(err.data.Message, 'Error!');
                            this.isPersistingProduct = false;
                            return this.$q.reject(err);
                        });
                }
            }
        }


        statusString(product: Domain.Product): string {
            return Domain.ProductStatus[product.Status];
        }

        isPublished(product: Domain.Product): boolean {
            return product.Status == Domain.ProductStatus.Published;
        }
        isReviewing(product: Domain.Product): boolean {
            return product.Status == Domain.ProductStatus.Reviewing;
        }

        static $inject = ['#gaia.marketPlaceService', '$q', '#gaia.utils.notify', '#gaia.utils.domModel'];
        constructor(private marketplace: Services.MarketPlaceService, private $q: ng.IQService, private notify: Gaia.Utils.Services.NotifyService, private domModel: Gaia.Utils.Services.DomModelService) {

            this.listProducts(0, null);
        }
    }

    export class MerchantServicesViewModel {

        isSearching: boolean = false;
        isListingServices: boolean = true;
        isModifyingService: boolean = false;
        isPersistingService: boolean = false;

        currentService: Domain.Service = null;
        currentListingPage: number = 0;
        pageSize: number = 30;
        searchString: string = null;
        services: Utils.SequencePage<Domain.Service> = new Utils.SequencePage<Domain.Service>([], 0, 1, 0);

        switchState(state: any) {
            if (!Object.isNullOrUndefined(state)) {
                this.isSearching = this.isListingServices = this.isModifyingService = this.isPersistingService = false;
                (state as Object).keyValuePairs().forEach(kvp => this[kvp.Key] = kvp.Value);
            }
        }

        isCurrentServiceNascent(): boolean {
            if (Object.isNullOrUndefined(this.currentService)) return false;
            else if (this.currentService['$nascent'] == true) return true;
            else return false;
        }

        refreshServices() {
            this.currentListingPage = 0;
            this.searchString = null;
            this.listServices(this.currentListingPage, this.searchString);
        }

        listServices(pageIndex: number, search: string) {
            this.isSearching = true;
            this.marketplace.findMerchantServices(search, this.pageSize, pageIndex)
                .then(opr => {
                    this.services = opr.Result
                    this.isSearching = false;
                    this.currentListingPage = pageIndex;
                }, err => {
                    this.services = new Utils.SequencePage<Domain.Service>([], 0, 1, 0);
                    this.isSearching = false;
                    return this.$q.defer().reject();
                });
        }

        newService(init?: Func1<Domain.Service, void>): Domain.Service {
            var s = new Domain.Service();
            if (!Object.isNullOrUndefined(init)) init(s);
            return s;
        }
                
        addAndModify() {
            this.modifyService(this.newService(s => {
                s['$nascent'] = true;
            }));
        }

        modifyService(service: Domain.Service) {
            this.isListingServices = this.isSearching = false;
            this.isModifyingService = true;
            this.currentService = service;
        }

        search() {
            this.listServices(0, this.searchString);
        }

        persistCurrentService() {
            if (!Object.isNullOrUndefined(this.currentService) && !this.isPersistingService) {
                this.isPersistingService = true;

                if (this.currentService['$nascent']) {
                    this.marketplace
                        .addService(this.currentService)
                        .then(opr => {
                            this.currentService.EntityId = opr.Result;
                            this.currentService.CreatedBy = this.domModel.simpleModel.UserId;
                            this.notify.success('the Service was persisted successfully!');
                            this.isPersistingService = false;

                            delete this.currentService['$nascent'];
                            this.services.Page.push(this.currentService);

                            this.switchState({ isListingServices: true, currentService: null });
                        }, err => {
                            this.notify.error(err.data.Message, 'Error!');
                            this.isPersistingService = false;
                            return this.$q.reject(err);
                        });
                }
                else{
                    this.marketplace
                        .modifyService(this.currentService)
                        .then(opr => {
                            this.notify.success('the Service was persisted successfully!');
                            this.isPersistingService = false;

                            this.switchState({ isListingServices: true, currentService: null });
                        }, err => {
                            this.notify.error(err.data.Message, 'Error!');
                            this.isPersistingService = false;
                            return this.$q.reject(err);
                        });
                }
            }
        }


        statusString(service: Domain.Service): string {
            return Domain.ServiceStatus[service.Status];
        }

        isSuspended(service: Domain.Service): boolean {
            return service.Status == Domain.ServiceStatus.Suspended;
        }
        isUnavailable(service: Domain.Service): boolean {
            return service.Status == Domain.ServiceStatus.Unavailable;
        }
        isAvailable(service: Domain.Service): boolean {
            return service.Status == Domain.ServiceStatus.Available;
        }

        static $inject = ['#gaia.marketPlaceService', '$q', '#gaia.utils.notify', '#gaia.utils.domModel'];
        constructor(private marketplace: Services.MarketPlaceService, private $q: ng.IQService, private notify: Gaia.Utils.Services.NotifyService, private domModel: Gaia.Utils.Services.DomModelService) {

            this.listServices(0, null);
        }
    }

    export class MerchantOrdersViewModel {


        static $inject = [];
        constructor() {
        }
    }
}


//Customer
module Gaia.ViewModels.MarketPlace {


    export class CustomerViewModel {

        private notify: Utils.Services.NotifyService;
        private marketPlace: Services.MarketPlaceService;

        private currentPage: number;
        private pageSize: number;
        private searchString: string;

        products: Domain.Product[];
        isRefreshingProducts: boolean;


        refreshProducts() {
            //this.isRefreshingProducts = true;
            //this.marketPlace
            //    .findCustomerProduct(this.searchString, this.pageSize, this.currentPage)
            //    .then(opr => {

            //        this.isRefreshingProducts = false;
            //    }, err => {

            //        this.isRefreshingProducts = false;
            //    });

            for (var cnt = 0; cnt < 20; cnt++) {
                this.products.push(new Domain.Product({
                    TransactionId: '56435ytr-6435ytrt-tjr53ytrefd-'+cnt,
                    Title: 'random title here - '+cnt,
                    Description: 'random description here and everywhere else; blah, blah, blah...'+cnt,
                    Status: Domain.ProductStatus.Published,
                    Cost: 6543,
                    StockCount: 2456,
                    Tags: null,
                    EntityId: 43
                }));
            }
        }



        static $inject = ['#gaia.utils.notify', '#gaia.marketPlaceService'];
        constructor(notify, marketPlace) {
            this.notify = notify;
            this.marketPlace = marketPlace;

            this.currentPage = 0;
            this.pageSize = 50;
            this.searchString = null;
            this.products = [];

            this.refreshProducts();
        }
    }

    export class CustomerProductsViewModel {

    }

    export class CustomerProductDetailsViewModel {

    }

    export class CustomerCartViewModel {

    }

    export class CustomerCheckoutViewModel {

    }

    export class CustomerOrderHistoryViewModel {

    }

    export class CustomerInvoiceViewModel {

    }

}

module Gaia.Directives.MarketPlace{


    export class SmallProductCard {

        restrict: string = 'E';
        $scope: any = null;
        scope: any = {
            product: '='
        };

        template: string = '' +
        '<div class="material-shadow small-product-card" style="{{style}}">'+
        '<div class= "material-interactive material-shadow primary-button" ng-click="vm.addToCart()"></div>' +
        '<div class="primary-icon btn btn-icon"><i class="icon-cart-add"></i></div>' +
        '<div class= "flex-container">'+
        '<div></div>'+
        '<div class= "product-details">'+
        '<div>'+
        '<strong>{{product.Title}}</strong>'+
        '</div>'+
        '<div>'+
        '<small ng-bind-html="product.Description"></small>'+
        '</div>'+
        '<div>'+
        '<div></div>'+
        '<div class="product-price"> <strong class="text-muted">&#8358;{{product.Cost}} </strong></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>';

        controller($scope: any) {
            $scope.vm = this;
            this.$scope = $scope;
        }

        link(scope: ng.IScope, element, attributes: ng.IAttributes): void {
            scope['style'] = attributes['stylel'];
        }

        addToCart() {
            this.marketPlace.addToBasket((this.$scope.product as Domain.Product).EntityId, Domain.ItemType.Product)
                .then(oprc => {
                    this.notify.success(this.$scope.product.Title + ' was added to your cart');
                }, err => {
                    this.notify.error('Something went wrong');
                });
        }
        addToList(list: string) {
            this.marketPlace.addToList(list, (this.$scope.product as Domain.Product).EntityId, Domain.ItemType.Product)
                .then(oprc => {
                    this.notify.success(this.$scope.product.Title + ' was added to your cart');
                }, err => {
                    this.notify.error('Something went wrong');
                });
        }

        constructor(private marketPlace: Services.MarketPlaceService,
            private notify: Utils.Services.NotifyService,
            private $compile: ng.ICompileService) {
        }
    }


    export class LargeProductCard {
        
        restrict: string = 'E';
        $scope: any = null;
        scope: any = {
            product: '='
        };

        template: string = '' +
        '<div style="{{style}}" class="material-shadow large-product-card">' +
        '<div class="material-interactive material-shadow primary-button"></div>' +
        '<div class="primary-icon btn"><i class="icon-cart-add"></i></div>' +
        '<div class= "flex-container">' +
        '<div></div>' +
        '<div class= "product-details">' +
        '<div>' +
        '<strong>{{product.Title}}</strong>' +
        '</div>' +
        '<div>' +
        '<small ng-bind-html="product.Description"></small>' +
        '</div>' +
        '<div>' +
        '<div class="product-price"><strong class="text-muted">&#8358;{{product.Cost}}</strong></div>' +
        '<div></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

        controller($scope: any) {
            $scope.vm = this;
            this.$scope = $scope;
        }

        link(scope: ng.IScope, element, attributes: ng.IAttributes): void {
            scope['style'] = attributes['stylel'];
        }

        addToCart() {
            this.marketPlace.addToBasket((this.$scope.product as Domain.Product).EntityId, Domain.ItemType.Product)
                .then(oprc => {
                    this.notify.success(this.$scope.product.Title + ' was added to your cart');
                }, err => {
                    this.notify.error('Something went wrong');
                });
        }
        addToList(list: string) {

        }

        constructor(private marketPlace: Services.MarketPlaceService,
            private notify: Utils.Services.NotifyService,
            private $compile: ng.ICompileService) {
        }
    }
}