

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

    }

}