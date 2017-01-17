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
                        return this.accessProfiles.contains(Gaia.Utils.ServiceProvierAccountProfile);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MarketPlaceViewModel.prototype, "isFarmerAccount", {
                    get: function () {
                        return this.accessProfiles.contains(Gaia.Utils.FarmerAccountProfile);
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
                return MarketPlaceViewModel;
            }());
            MarketPlaceViewModel.$inject = ['#gaia.contextToolbar', '#gaia.utils.domModel', '$state'];
            MarketPlace.MarketPlaceViewModel = MarketPlaceViewModel;
            var PreferencesViewModel = (function () {
                function PreferencesViewModel() {
                }
                return PreferencesViewModel;
            }());
            MarketPlace.PreferencesViewModel = PreferencesViewModel;
        })(MarketPlace = ViewModels.MarketPlace || (ViewModels.MarketPlace = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
//Merchant
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var MarketPlace;
        (function (MarketPlace) {
            var MerchantViewModel = (function () {
                function MerchantViewModel($state, domModels) {
                    this.$state = $state;
                    this.domModels = domModels;
                    if (this.$state.current.name == 'merchant')
                        this.$state.go('merchant.services');
                }
                Object.defineProperty(MerchantViewModel.prototype, "accessProfiles", {
                    get: function () {
                        return this.domModels.simpleModel.AccessProfiles.split(',');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MerchantViewModel.prototype, "isMerchantAccount", {
                    get: function () {
                        return this.accessProfiles.contains(Gaia.Utils.ServiceProvierAccountProfile);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MerchantViewModel.prototype, "isFarmerAccount", {
                    get: function () {
                        return this.accessProfiles.contains(Gaia.Utils.FarmerAccountProfile);
                    },
                    enumerable: true,
                    configurable: true
                });
                MerchantViewModel.prototype.isServicesActive = function () {
                    return this.$state.current.name == 'merchant.services';
                };
                MerchantViewModel.prototype.isOrdersActive = function () {
                    return this.$state.current.name == 'merchant.orders';
                };
                MerchantViewModel.prototype.isProductsActive = function () {
                    return this.$state.current.name == 'merchant.products';
                };
                return MerchantViewModel;
            }());
            MerchantViewModel.$inject = ['$state', '#gaia.utils.domModel'];
            MarketPlace.MerchantViewModel = MerchantViewModel;
            var MerchantProductsViewModel = (function () {
                function MerchantProductsViewModel(marketplace, $q, notify, domModel) {
                    this.marketplace = marketplace;
                    this.$q = $q;
                    this.notify = notify;
                    this.domModel = domModel;
                    this.isSearching = false;
                    this.isListingProducts = true;
                    this.isModifyingProduct = false;
                    this.isPersistingProduct = false;
                    this.currentProduct = null;
                    this.currentListingPage = 0;
                    this.pageSize = 30;
                    this.searchString = null;
                    this.products = new Gaia.Utils.SequencePage([], 0, 1, 0);
                    this.listProducts(0, null);
                }
                MerchantProductsViewModel.prototype.switchState = function (state) {
                    var _this = this;
                    if (!Object.isNullOrUndefined(state)) {
                        this.isSearching = this.isListingProducts = this.isModifyingProduct = this.isPersistingProduct = false;
                        state.keyValuePairs().forEach(function (kvp) { return _this[kvp.Key] = kvp.Value; });
                    }
                };
                MerchantProductsViewModel.prototype.isCurrentProductNascent = function () {
                    if (Object.isNullOrUndefined(this.currentProduct))
                        return false;
                    else if (this.currentProduct['$nascent'] == true)
                        return true;
                    else
                        return false;
                };
                MerchantProductsViewModel.prototype.refreshProducts = function () {
                    this.currentListingPage = 0;
                    this.searchString = null;
                    this.listProducts(this.currentListingPage, this.searchString);
                };
                MerchantProductsViewModel.prototype.listProducts = function (pageIndex, search) {
                    var _this = this;
                    this.isSearching = true;
                    this.marketplace.findMerchantProducts(search, this.pageSize, pageIndex)
                        .then(function (opr) {
                        _this.products = opr.Result;
                        _this.isSearching = false;
                        _this.currentListingPage = pageIndex;
                    }, function (err) {
                        _this.products = new Gaia.Utils.SequencePage([], 0, 1, 0);
                        _this.isSearching = false;
                        return _this.$q.defer().reject();
                    });
                };
                MerchantProductsViewModel.prototype.newProduct = function (init) {
                    var p = new Gaia.Domain.Product();
                    if (!Object.isNullOrUndefined(init))
                        init(p);
                    return p;
                };
                MerchantProductsViewModel.prototype.addAndModify = function () {
                    this.modifyProduct(this.newProduct(function (s) {
                        s['$nascent'] = true;
                    }));
                };
                MerchantProductsViewModel.prototype.modifyProduct = function (product) {
                    this.isListingProducts = this.isSearching = false;
                    this.isModifyingProduct = true;
                    this.currentProduct = product;
                };
                MerchantProductsViewModel.prototype.search = function () {
                    this.listProducts(0, this.searchString);
                };
                MerchantProductsViewModel.prototype.persistCurrentProduct = function () {
                    var _this = this;
                    if (!Object.isNullOrUndefined(this.currentProduct) && !this.isPersistingProduct) {
                        this.isPersistingProduct = true;
                        if (this.currentProduct['$nascent']) {
                            this.marketplace
                                .addProduct(this.currentProduct)
                                .then(function (opr) {
                                _this.currentProduct.EntityId = opr.Result;
                                _this.currentProduct.CreatedBy = _this.domModel.simpleModel.UserId;
                                _this.notify.success('the Product was persisted successfully!');
                                _this.isPersistingProduct = false;
                                delete _this.currentProduct['$nascent'];
                                _this.products.Page.push(_this.currentProduct);
                                _this.switchState({ isListingProducts: true, currentProduct: null });
                            }, function (err) {
                                _this.notify.error(err.data.Message, 'Error!');
                                _this.isPersistingProduct = false;
                                return _this.$q.reject(err);
                            });
                        }
                        else {
                            this.marketplace
                                .modifyProduct(this.currentProduct)
                                .then(function (opr) {
                                _this.notify.success('the Product was persisted successfully!');
                                _this.isPersistingProduct = false;
                                _this.switchState({ isListingProducts: true, currentProduct: null });
                            }, function (err) {
                                _this.notify.error(err.data.Message, 'Error!');
                                _this.isPersistingProduct = false;
                                return _this.$q.reject(err);
                            });
                        }
                    }
                };
                MerchantProductsViewModel.prototype.statusString = function (product) {
                    return Gaia.Domain.ProductStatus[product.Status];
                };
                MerchantProductsViewModel.prototype.isPublished = function (product) {
                    return product.Status == Gaia.Domain.ProductStatus.Published;
                };
                MerchantProductsViewModel.prototype.isReviewing = function (product) {
                    return product.Status == Gaia.Domain.ProductStatus.Reviewing;
                };
                return MerchantProductsViewModel;
            }());
            MerchantProductsViewModel.$inject = ['#gaia.marketPlaceService', '$q', '#gaia.utils.notify', '#gaia.utils.domModel'];
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
                return MerchantServicesViewModel;
            }());
            MerchantServicesViewModel.$inject = ['#gaia.marketPlaceService', '$q', '#gaia.utils.notify', '#gaia.utils.domModel'];
            MarketPlace.MerchantServicesViewModel = MerchantServicesViewModel;
            var MerchantOrdersViewModel = (function () {
                function MerchantOrdersViewModel() {
                }
                return MerchantOrdersViewModel;
            }());
            MerchantOrdersViewModel.$inject = [];
            MarketPlace.MerchantOrdersViewModel = MerchantOrdersViewModel;
        })(MarketPlace = ViewModels.MarketPlace || (ViewModels.MarketPlace = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
//Customer
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var MarketPlace;
        (function (MarketPlace) {
            var CustomerViewModel = (function () {
                function CustomerViewModel() {
                }
                return CustomerViewModel;
            }());
            MarketPlace.CustomerViewModel = CustomerViewModel;
        })(MarketPlace = ViewModels.MarketPlace || (ViewModels.MarketPlace = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
