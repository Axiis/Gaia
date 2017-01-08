

module Gaia.ViewModels.MarketPlace {

    export class MarketPlaceViewModel {

        get accessProfiles(): string[] {
            return this.domModels.simpleModel.AccessProfiles.split(',');
        }
        get isMerchantAccount(): boolean {
            return this.accessProfiles.contains('system.[Service-Provider Profile]');
        }
        get isFarmerAccount(): boolean {
            return this.accessProfiles.contains('system.[Farmer Profile]');
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


    export class CustomerViewModel {

    }


    export class MerchantViewModel {


        isServicesActive(): boolean {
            return this.$state.current.name == 'merchant.services';
        }
        isOrdersActive(): boolean {
            return this.$state.current.name == 'merchant.orders';
        }
        isProductsActive(): boolean {
            return this.$state.current.name == 'merchant.products';
        }

        static $inject = ['$state'];
        constructor(private $state: ng.ui.IStateService) {
            if (this.$state.current.name == 'merchant') this.$state.go('merchant.services');
        }
    }

    export class MerchantProductsViewModel {

        static $inject = [];
        constructor() {
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


    export class ConfigureViewModel {

    }
}