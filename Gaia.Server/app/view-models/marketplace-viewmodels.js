var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var MarketPlace;
        (function (MarketPlace) {
            var MarketPlaceViewModel = (function () {
                function MarketPlaceViewModel(contextToolbar, domModels, state) {
                    this.contextToolbar = contextToolbar;
                    this.domModels = domModels;
                    this.state = state;
                }
                Object.defineProperty(MarketPlaceViewModel.prototype, "accessProfiles", {
                    get: function () {
                        return this.domModels.simpleModel.AccessProfiles.split(',');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MarketPlaceViewModel.prototype, "isMerchantAccount", {
                    get: function () {
                        return this.accessProfiles.contains('system.[Service-Provider Profile]');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MarketPlaceViewModel.prototype, "isFarmerAccount", {
                    get: function () {
                        return this.accessProfiles.contains('system.[Farmer Profile]');
                    },
                    enumerable: true,
                    configurable: true
                });
                MarketPlaceViewModel.prototype.isMerchantActive = function () {
                    return this.state.current.name.startsWith('merchant');
                };
                MarketPlaceViewModel.prototype.isPreferencesActive = function () {
                    return this.state.current.name.startsWith('configure');
                };
                MarketPlaceViewModel.prototype.isCustomerActive = function () {
                    return this.state.current.name.startsWith('customer');
                };
                MarketPlaceViewModel.$inject = ['#gaia.contextToolbar', '#gaia.utils.domModel', '$state'];
                return MarketPlaceViewModel;
            }());
            MarketPlace.MarketPlaceViewModel = MarketPlaceViewModel;
            var CustomerViewModel = (function () {
                function CustomerViewModel() {
                }
                return CustomerViewModel;
            }());
            MarketPlace.CustomerViewModel = CustomerViewModel;
            var MerchantViewModel = (function () {
                function MerchantViewModel($state) {
                    this.$state = $state;
                    if (this.$state.current.name == 'merchant')
                        this.$state.go('merchant.services');
                }
                MerchantViewModel.prototype.isServicesActive = function () {
                    return this.$state.current.name == 'merchant.services';
                };
                MerchantViewModel.prototype.isOrdersActive = function () {
                    return this.$state.current.name == 'merchant.orders';
                };
                MerchantViewModel.prototype.isProductsActive = function () {
                    return this.$state.current.name == 'merchant.products';
                };
                MerchantViewModel.$inject = ['$state'];
                return MerchantViewModel;
            }());
            MarketPlace.MerchantViewModel = MerchantViewModel;
            var MerchantProductsViewModel = (function () {
                function MerchantProductsViewModel() {
                }
                MerchantProductsViewModel.$inject = [];
                return MerchantProductsViewModel;
            }());
            MarketPlace.MerchantProductsViewModel = MerchantProductsViewModel;
            var MerchantServicesViewModel = (function () {
                function MerchantServicesViewModel(marketplace, $q, notify, domModel) {
                    this.marketplace = marketplace;
                    this.$q = $q;
                    this.notify = notify;
                    this.domModel = domModel;
                    this.isSearching = false;
                    this.isListingServices = true;
                    this.isModifyingService = false;
                    this.isPersistingService = false;
                    this.currentService = null;
                    this.currentListingPage = 0;
                    this.pageSize = 30;
                    this.searchString = null;
                    this.services = new Gaia.Utils.SequencePage([], 0, 1, 0);
                    this.listServices(0, null);
                }
                MerchantServicesViewModel.prototype.switchState = function (state) {
                    var _this = this;
                    if (!Object.isNullOrUndefined(state)) {
                        this.isSearching = this.isListingServices = this.isModifyingService = this.isPersistingService = false;
                        state.keyValuePairs().forEach(function (kvp) { return _this[kvp.Key] = kvp.Value; });
                    }
                };
                MerchantServicesViewModel.prototype.isCurrentServiceNascent = function () {
                    if (Object.isNullOrUndefined(this.currentService))
                        return false;
                    else if (this.currentService['$nascent'] == true)
                        return true;
                    else
                        return false;
                };
                MerchantServicesViewModel.prototype.refreshServices = function () {
                    this.currentListingPage = 0;
                    this.searchString = null;
                    this.listServices(this.currentListingPage, this.searchString);
                };
                MerchantServicesViewModel.prototype.listServices = function (pageIndex, search) {
                    var _this = this;
                    this.isSearching = true;
                    this.marketplace.findMerchantServices(search, this.pageSize, pageIndex)
                        .then(function (opr) {
                        _this.services = opr.Result;
                        _this.isSearching = false;
                        _this.currentListingPage = pageIndex;
                    }, function (err) {
                        _this.services = new Gaia.Utils.SequencePage([], 0, 1, 0);
                        _this.isSearching = false;
                        return _this.$q.defer().reject();
                    });
                };
                MerchantServicesViewModel.prototype.newService = function (init) {
                    var s = new Gaia.Domain.Service();
                    if (!Object.isNullOrUndefined(init))
                        init(s);
                    return s;
                };
                MerchantServicesViewModel.prototype.addAndModify = function () {
                    this.modifyService(this.newService(function (s) {
                        s['$nascent'] = true;
                    }));
                };
                MerchantServicesViewModel.prototype.modifyService = function (service) {
                    this.isListingServices = this.isSearching = false;
                    this.isModifyingService = true;
                    this.currentService = service;
                };
                MerchantServicesViewModel.prototype.search = function () {
                    this.listServices(0, this.searchString);
                };
                MerchantServicesViewModel.prototype.persistCurrentService = function () {
                    var _this = this;
                    if (!Object.isNullOrUndefined(this.currentService) && !this.isPersistingService) {
                        this.isPersistingService = true;
                        if (this.currentService['$nascent']) {
                            this.marketplace
                                .addService(this.currentService)
                                .then(function (opr) {
                                _this.currentService.EntityId = opr.Result;
                                _this.currentService.CreatedBy = _this.domModel.simpleModel.UserId;
                                _this.notify.success('the Service was persisted successfully!');
                                _this.isPersistingService = false;
                                delete _this.currentService['$nascent'];
                                _this.services.Page.push(_this.currentService);
                                _this.switchState({ isListingServices: true, currentService: null });
                            }, function (err) {
                                _this.notify.error(err.data.Message, 'Error!');
                                _this.isPersistingService = false;
                                return _this.$q.reject(err);
                            });
                        }
                        else {
                            this.marketplace
                                .modifyService(this.currentService)
                                .then(function (opr) {
                                _this.notify.success('the Service was persisted successfully!');
                                _this.isPersistingService = false;
                                _this.switchState({ isListingServices: true, currentService: null });
                            }, function (err) {
                                _this.notify.error(err.data.Message, 'Error!');
                                _this.isPersistingService = false;
                                return _this.$q.reject(err);
                            });
                        }
                    }
                };
                MerchantServicesViewModel.prototype.statusString = function (service) {
                    return Gaia.Domain.ServiceStatus[service.Status];
                };
                MerchantServicesViewModel.prototype.isSuspended = function (service) {
                    return service.Status == Gaia.Domain.ServiceStatus.Suspended;
                };
                MerchantServicesViewModel.prototype.isUnavailable = function (service) {
                    return service.Status == Gaia.Domain.ServiceStatus.Unavailable;
                };
                MerchantServicesViewModel.prototype.isAvailable = function (service) {
                    return service.Status == Gaia.Domain.ServiceStatus.Available;
                };
                MerchantServicesViewModel.$inject = ['#gaia.marketPlaceService', '$q', '#gaia.utils.notify', '#gaia.utils.domModel'];
                return MerchantServicesViewModel;
            }());
            MarketPlace.MerchantServicesViewModel = MerchantServicesViewModel;
            var MerchantOrdersViewModel = (function () {
                function MerchantOrdersViewModel() {
                }
                MerchantOrdersViewModel.$inject = [];
                return MerchantOrdersViewModel;
            }());
            MarketPlace.MerchantOrdersViewModel = MerchantOrdersViewModel;
            var ConfigureViewModel = (function () {
                function ConfigureViewModel() {
                }
                return ConfigureViewModel;
            }());
            MarketPlace.ConfigureViewModel = ConfigureViewModel;
        })(MarketPlace = ViewModels.MarketPlace || (ViewModels.MarketPlace = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=marketplace-viewmodels.js.map