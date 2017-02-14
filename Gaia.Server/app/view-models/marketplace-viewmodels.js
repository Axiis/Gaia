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
                MerchantProductsViewModel.prototype.hasProductTitle = function () {
                    if (Object.isNullOrUndefined(this.currentProduct))
                        return false;
                    else
                        return !Object.isNullOrUndefined(this.currentProduct.Title) &&
                            this.currentProduct.Title != '';
                };
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
                    else if (this.currentProduct['$_nascent'] == true)
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
                        //load the product's images
                        _this.products.Page.forEach(function (_product) {
                            _product['$_isLoadingImages'] = true;
                            _this.marketplace.getProductImages(_product.EntityId)
                                .then(function (opr) {
                                _product.Images.clear();
                                opr.Result.forEach(function (_ref) {
                                    _ref['$_owner'] = _product;
                                    _product.Images.push(_ref);
                                });
                                delete _product['$_isLoadingImages'];
                            }, function (err) {
                                _this.notify.error('Could not product images', 'Oops!');
                                return _this.$q.reject();
                            });
                        });
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
                        s['$_nascent'] = true;
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
                        if (this.currentProduct['$_nascent']) {
                            this.marketplace
                                .addProduct(this.currentProduct)
                                .then(function (opr) {
                                _this.currentProduct.EntityId = opr.Result;
                                _this.currentProduct.CreatedBy = _this.domModel.simpleModel.UserId;
                                _this.notify.success('the Product was persisted successfully!');
                                _this.isPersistingProduct = false;
                                delete _this.currentProduct['$_nascent'];
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
                MerchantProductsViewModel.prototype.productImageRef = function (imageRef) {
                    return 'url(' + imageRef.Uri + ')';
                };
                MerchantProductsViewModel.prototype.isModifyingExistingProduct = function () {
                    return this.isModifyingProduct && !this.isCurrentProductNascent();
                };
                MerchantProductsViewModel.prototype.removeImage = function (ref) {
                    var _this = this;
                    if (ref['$_isRemovingImage'])
                        return;
                    ref['$_isRemovingImage'] = true;
                    this.marketplace.removeProductImage(ref.Uri)
                        .then(function (opr) {
                        _this.notify.success("The Image has been deleted");
                        ref['$_owner'].Images.remove(ref);
                        delete ref['$_isRemovingImage'];
                        delete ref['$_owner'];
                    }, function (err) {
                        _this.notify.error("The Image was not deleted", "Oops!");
                        delete ref['$_isRemovingImage'];
                    });
                };
                Object.defineProperty(MerchantProductsViewModel.prototype, "uploadImage", {
                    set: function (data) {
                        var _this = this;
                        var _product = this.currentProduct;
                        if (_product['$_isPersistingImage'])
                            return;
                        _product['$_isPersistingImage'] = true;
                        this.marketplace.addProductImage(this.currentProduct.EntityId, data)
                            .then(function (opr) {
                            _this.notify.success("The image was persisted successfully");
                            _this.currentProduct.Images.push(new Gaia.Domain.BlobRef({
                                Uri: opr.Result,
                                Metadata: null
                            }));
                            $('#uploadImageForm')[0].reset();
                            delete _product['$_isPersistingImage'];
                        }, function (err) {
                            _this.notify.error("An error occured...", "Oops!");
                            $('#uploadImageForm')[0].reset();
                            delete _product['$_isPersistingImage'];
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
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
                MerchantServicesViewModel.prototype.hasServiceTitle = function () {
                    if (Object.isNullOrUndefined(this.currentService))
                        return false;
                    else
                        return !Object.isNullOrUndefined(this.currentService.Title) &&
                            this.currentService.Title != '';
                };
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
                    else if (this.currentService['$_nascent'] == true)
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
                        //load the service's images
                        _this.services.Page.forEach(function (_service) {
                            _service['$_isLoadingImages'] = true;
                            _this.marketplace.getServiceImages(_service.EntityId)
                                .then(function (opr) {
                                _service.Images.clear();
                                opr.Result.forEach(function (_ref) {
                                    _ref['$_owner'] = _service;
                                    _service.Images.push(_ref);
                                });
                                delete _service['$_isLoadingImages'];
                            }, function (err) {
                                _this.notify.error('Could not service images', 'Oops!');
                                return _this.$q.reject();
                            });
                        });
                    }, function (err) {
                        _this.services = new Gaia.Utils.SequencePage([], 0, 1, 0);
                        _this.isSearching = false;
                        return _this.$q.defer().reject();
                    });
                };
                MerchantServicesViewModel.prototype.newService = function (init) {
                    var p = new Gaia.Domain.Service();
                    if (!Object.isNullOrUndefined(init))
                        init(p);
                    return p;
                };
                MerchantServicesViewModel.prototype.addAndModify = function () {
                    this.modifyService(this.newService(function (s) {
                        s['$_nascent'] = true;
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
                        if (this.currentService['$_nascent']) {
                            this.marketplace
                                .addService(this.currentService)
                                .then(function (opr) {
                                _this.currentService.EntityId = opr.Result;
                                _this.currentService.CreatedBy = _this.domModel.simpleModel.UserId;
                                _this.notify.success('the Service was persisted successfully!');
                                _this.isPersistingService = false;
                                delete _this.currentService['$_nascent'];
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
                MerchantServicesViewModel.prototype.serviceImageRef = function (imageRef) {
                    return 'url(' + imageRef.Uri + ')';
                };
                MerchantServicesViewModel.prototype.isModifyingExistingService = function () {
                    return this.isModifyingService && !this.isCurrentServiceNascent();
                };
                MerchantServicesViewModel.prototype.removeImage = function (ref) {
                    var _this = this;
                    if (ref['$_isRemovingImage'])
                        return;
                    ref['$_isRemovingImage'] = true;
                    this.marketplace.removeServiceImage(ref.Uri)
                        .then(function (opr) {
                        _this.notify.success("The Image has been deleted");
                        ref['$_owner'].Images.remove(ref);
                        delete ref['$_isRemovingImage'];
                        delete ref['$_owner'];
                    }, function (err) {
                        _this.notify.error("The Image was not deleted", "Oops!");
                        delete ref['$_isRemovingImage'];
                    });
                };
                Object.defineProperty(MerchantServicesViewModel.prototype, "uploadImage", {
                    set: function (data) {
                        var _this = this;
                        var _service = this.currentService;
                        if (_service['$_isPersistingImage'])
                            return;
                        _service['$_isPersistingImage'] = true;
                        this.marketplace.addServiceImage(this.currentService.EntityId, data)
                            .then(function (opr) {
                            _this.notify.success("The image was persisted successfully");
                            _this.currentService.Images.push(new Gaia.Domain.BlobRef({
                                Uri: opr.Result,
                                Metadata: null
                            }));
                            $('#uploadImageForm')[0].reset();
                            delete _service['$_isPersistingImage'];
                        }, function (err) {
                            _this.notify.error("An error occured...", "Oops!");
                            $('#uploadImageForm')[0].reset();
                            delete _service['$_isPersistingImage'];
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                MerchantServicesViewModel.prototype.statusString = function (service) {
                    return Gaia.Domain.ServiceStatus[service.Status];
                };
                MerchantServicesViewModel.prototype.isAvailable = function (service) {
                    return service.Status == Gaia.Domain.ServiceStatus.Available;
                };
                MerchantServicesViewModel.prototype.isSuspended = function (service) {
                    return service.Status == Gaia.Domain.ServiceStatus.Suspended;
                };
                MerchantServicesViewModel.prototype.isUnavailable = function (service) {
                    return service.Status == Gaia.Domain.ServiceStatus.Unavailable;
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
                function CustomerViewModel(notify, marketPlace) {
                    this.notify = notify;
                    this.marketPlace = marketPlace;
                    this.currentPage = 0;
                    this.pageSize = 50;
                    this.searchString = null;
                    this.products = [];
                    this.refreshProducts();
                }
                CustomerViewModel.prototype.refreshProducts = function () {
                    //this.isRefreshingProducts = true;
                    //this.marketPlace
                    //    .findCustomerProduct(this.searchString, this.pageSize, this.currentPage)
                    //    .then(opr => {
                    //        this.isRefreshingProducts = false;
                    //    }, err => {
                    //        this.isRefreshingProducts = false;
                    //    });
                    for (var cnt = 0; cnt < 20; cnt++) {
                        this.products.push(new Gaia.Domain.Product({
                            TransactionId: '56435ytr-6435ytrt-tjr53ytrefd-' + cnt,
                            Title: 'random title here - ' + cnt,
                            Description: 'random description here and everywhere else; blah, blah, blah...' + cnt,
                            Status: Gaia.Domain.ProductStatus.Published,
                            Cost: 6543,
                            StockCount: 2456,
                            Tags: null,
                            EntityId: 43
                        }));
                    }
                };
                return CustomerViewModel;
            }());
            CustomerViewModel.$inject = ['#gaia.utils.notify', '#gaia.marketPlaceService'];
            MarketPlace.CustomerViewModel = CustomerViewModel;
            var CustomerProductsViewModel = (function () {
                function CustomerProductsViewModel() {
                }
                return CustomerProductsViewModel;
            }());
            MarketPlace.CustomerProductsViewModel = CustomerProductsViewModel;
            var CustomerProductDetailsViewModel = (function () {
                function CustomerProductDetailsViewModel() {
                }
                return CustomerProductDetailsViewModel;
            }());
            MarketPlace.CustomerProductDetailsViewModel = CustomerProductDetailsViewModel;
            var CustomerCartViewModel = (function () {
                function CustomerCartViewModel() {
                }
                return CustomerCartViewModel;
            }());
            MarketPlace.CustomerCartViewModel = CustomerCartViewModel;
            var CustomerCheckoutViewModel = (function () {
                function CustomerCheckoutViewModel() {
                }
                return CustomerCheckoutViewModel;
            }());
            MarketPlace.CustomerCheckoutViewModel = CustomerCheckoutViewModel;
            var CustomerOrderHistoryViewModel = (function () {
                function CustomerOrderHistoryViewModel() {
                }
                return CustomerOrderHistoryViewModel;
            }());
            MarketPlace.CustomerOrderHistoryViewModel = CustomerOrderHistoryViewModel;
            var CustomerInvoiceViewModel = (function () {
                function CustomerInvoiceViewModel() {
                }
                return CustomerInvoiceViewModel;
            }());
            MarketPlace.CustomerInvoiceViewModel = CustomerInvoiceViewModel;
        })(MarketPlace = ViewModels.MarketPlace || (ViewModels.MarketPlace = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
(function (Gaia) {
    var Directives;
    (function (Directives) {
        var MarketPlace;
        (function (MarketPlace) {
            var SmallProductCard = (function () {
                function SmallProductCard(marketPlace, notify, $compile) {
                    this.marketPlace = marketPlace;
                    this.notify = notify;
                    this.$compile = $compile;
                    this.restrict = 'E';
                    this.$scope = null;
                    this.scope = {
                        product: '='
                    };
                    this.template = '' +
                        '<div class="material-shadow small-product-card" style="{{style}}">' +
                        '<div class= "material-interactive material-shadow primary-button" ng-click="vm.addToCart()"></div>' +
                        '<div class="primary-icon btn btn-icon"><i class="icon-cart-add"></i></div>' +
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
                        '<div></div>' +
                        '<div class="product-price"> <strong class="text-muted">&#8358;{{product.Cost}} </strong></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                SmallProductCard.prototype.controller = function ($scope) {
                    $scope.vm = this;
                    this.$scope = $scope;
                };
                SmallProductCard.prototype.link = function (scope, element, attributes) {
                    scope['style'] = attributes['stylel'];
                };
                SmallProductCard.prototype.addToCart = function () {
                    var _this = this;
                    this.marketPlace.addToBasket(this.$scope.product.EntityId, Gaia.Domain.ItemType.Product)
                        .then(function (oprc) {
                        _this.notify.success(_this.$scope.product.Title + ' was added to your cart');
                    }, function (err) {
                        _this.notify.error('Something went wrong');
                    });
                };
                SmallProductCard.prototype.addToList = function (list) {
                    var _this = this;
                    this.marketPlace.addToList(list, this.$scope.product.EntityId, Gaia.Domain.ItemType.Product)
                        .then(function (oprc) {
                        _this.notify.success(_this.$scope.product.Title + ' was added to your cart');
                    }, function (err) {
                        _this.notify.error('Something went wrong');
                    });
                };
                return SmallProductCard;
            }());
            MarketPlace.SmallProductCard = SmallProductCard;
            var LargeProductCard = (function () {
                function LargeProductCard(marketPlace, notify, $compile) {
                    this.marketPlace = marketPlace;
                    this.notify = notify;
                    this.$compile = $compile;
                    this.restrict = 'E';
                    this.$scope = null;
                    this.scope = {
                        product: '='
                    };
                    this.template = '' +
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
                }
                LargeProductCard.prototype.controller = function ($scope) {
                    $scope.vm = this;
                    this.$scope = $scope;
                };
                LargeProductCard.prototype.link = function (scope, element, attributes) {
                    scope['style'] = attributes['stylel'];
                };
                LargeProductCard.prototype.addToCart = function () {
                    var _this = this;
                    this.marketPlace.addToBasket(this.$scope.product.EntityId, Gaia.Domain.ItemType.Product)
                        .then(function (oprc) {
                        _this.notify.success(_this.$scope.product.Title + ' was added to your cart');
                    }, function (err) {
                        _this.notify.error('Something went wrong');
                    });
                };
                LargeProductCard.prototype.addToList = function (list) {
                };
                return LargeProductCard;
            }());
            MarketPlace.LargeProductCard = LargeProductCard;
        })(MarketPlace = Directives.MarketPlace || (Directives.MarketPlace = {}));
    })(Directives = Gaia.Directives || (Gaia.Directives = {}));
})(Gaia || (Gaia = {}));
