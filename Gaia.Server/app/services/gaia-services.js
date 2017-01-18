var Gaia;
(function (Gaia) {
    var Services;
    (function (Services) {
        var BlobService = (function () {
            function BlobService(transport) {
                this.transport = transport;
            }
            BlobService.$inject = ['#gaia.utils.domainTransport'];
            return BlobService;
        }());
        Services.BlobService = BlobService;
        var ProfileService = (function () {
            function ProfileService(transport) {
                this.transport = transport;
            }
            ProfileService.prototype.registerUser = function (targetUser, credentials, config) {
                return this.transport.post('/api/profiles', {
                    TargetUser: targetUser,
                    Credentials: credentials
                }, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.registerAdminUser = function (targetUser, secretCredentials, config) {
                return this.transport.post('/api/admin-profiles', {
                    TargetUser: targetUser,
                    Credentials: secretCredentials
                }, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.verifyUserRegistration = function (targetUser, verificationToken, config) {
                return this.transport.put('/api/profiles/verification', {
                    User: targetUser,
                    Value: verificationToken
                }, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.archiveUser = function (userId, config) {
                return this.transport.put('/api/profiles/archives', {
                    User: userId
                }, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.createActivationVerification = function (userId, config) {
                return this.transport.put('/api/profiles/activation', {
                    User: userId
                }, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.verifyUserActivation = function (userId, token, config) {
                return this.transport.put('/api/profiles/activation', {
                    User: userId,
                    Value: token
                }, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.getUserData = function (config) {
                return this.transport.get('/api/profiles/data/all', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_ud) { return new Axis.Pollux.Domain.UserData(_ud); }) : [];
                    return oprc.data;
                });
            };
            ProfileService.prototype.getUserDataByName = function (name, config) {
                return this.transport.get('/api/profiles/data', {
                    Name: name
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Axis.Pollux.Domain.UserData(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.addData = function (data, config) {
                return this.transport.put('/api/profiles/data', {
                    DataList: data
                }, config).then(function (oprc) {
                    data.forEach(function (value, index) {
                        if (value.EntityId <= 0)
                            value.EntityId = oprc.data.Result[index];
                    });
                });
            };
            ProfileService.prototype.removeData = function (dataNames, config) {
                return this.transport.delete('/api/profiles/data', {
                    Names: dataNames
                }, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.updateProfileImage = function (blob, oldUrl, config) {
                return this.transport.put('/api/profiles/data/image', {
                    Blob: blob.RawObjectForm(),
                    OldImageUri: oldUrl
                }, config);
            };
            ProfileService.prototype.getBioData = function (config) {
                return this.transport.get('/api/profiles/bio-data', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.BioData(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.modifyBioData = function (biodata, config) {
                return this.transport.put('/api/profiles/bio-data', biodata, config).then(function (oprc) {
                    if (!biodata.EntityId || biodata.EntityId <= 0)
                        biodata.EntityId = oprc.data.Result;
                });
            };
            ProfileService.prototype.getContactData = function (config) {
                return this.transport.get('/api/profiles/contact-data', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Axis.Pollux.Domain.ContactData(_cd); }) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.addContactData = function (contactData, config) {
                return this.transport.post('/api/profiles/contact-data', contactData, config).then(function (oprc) {
                    contactData.EntityId = oprc.data.Result;
                });
            };
            ProfileService.prototype.modifyContactData = function (contactData, config) {
                return this.transport.put('/api/profiles/contact-data', contactData, config).then(function (oprc) { });
            };
            ProfileService.prototype.persistContactData = function (contactData) {
                if (!contactData.EntityId || contactData.EntityId <= 0)
                    return this.addContactData(contactData);
                else
                    return this.modifyContactData(contactData);
            };
            ProfileService.prototype.removeContactData = function (ids, config) {
                return this.transport.delete('/api/profiles/contact-data/?ids=' + ids.join(','), null, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.getCorporateData = function (config) {
                return this.transport.get('/api/profiles/corporate-data', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Axis.Pollux.Domain.CorporateData(_cd); }) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.addCorporateData = function (corporateData, config) {
                return this.transport.post('/api/profiles/corporate-data', corporateData, config).then(function (oprc) {
                    corporateData.EntityId = oprc.data.Result;
                });
            };
            ProfileService.prototype.modifyCorporateData = function (corporateData, config) {
                return this.transport.put('/api/profiles/corporate-data', corporateData, config).then(function (oprc) { });
            };
            ProfileService.prototype.persistCorporateData = function (data) {
                if (!data.EntityId || data.EntityId <= 0)
                    return this.addCorporateData(data);
                else
                    return this.modifyCorporateData(data);
            };
            ProfileService.prototype.removeCorporateData = function (ids, config) {
                return this.transport.delete('/api/profiles/corporate-data/?ids=' + ids.join(','), null, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.$inject = ["#gaia.utils.domainTransport"];
            return ProfileService;
        }());
        Services.ProfileService = ProfileService;
        var UserAccountService = (function () {
            function UserAccountService(transport) {
                this.transport = transport;
            }
            UserAccountService.prototype.getFarmAccounts = function (config) {
                return this.transport.get('/api/profiles/farm-account', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Gaia.Domain.Farm(_cd); }) : null;
                    return oprc.data;
                });
            };
            UserAccountService.prototype.addFarmAccount = function (FarmAccount, config) {
                return this.transport.post('/api/profiles/farm-account', FarmAccount, config).then(function (oprc) {
                    FarmAccount.EntityId = oprc.data.Result;
                });
            };
            UserAccountService.prototype.modifyFarmAccount = function (FarmAccount, config) {
                return this.transport.put('/api/profiles/farm-account', FarmAccount, config).then(function (oprc) { });
            };
            UserAccountService.prototype.persistFarm = function (data) {
                if (!data.EntityId || data.EntityId <= 0)
                    return this.addFarmAccount(data);
                else
                    return this.modifyFarmAccount(data);
            };
            UserAccountService.prototype.removeFarm = function (ids, config) {
                return this.transport.delete('/api/profiles/farm-account/?ids=' + ids.join(','), null, config).then(function (oprc) { return oprc.data; });
            };
            UserAccountService.$inject = ["#gaia.utils.domainTransport"];
            return UserAccountService;
        }());
        Services.UserAccountService = UserAccountService;
        var AccessProfileService = (function () {
            function AccessProfileService(transport) {
                this.transport = transport;
            }
            AccessProfileService.prototype.createFeatureAccessProfile = function (profileCode, title, config) {
                return this.transport.post('/api/access-profiles', {
                    Code: profileCode,
                    Title: title
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.FeatureAccessProfile(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            AccessProfileService.prototype.modifyFeatureAccessProfile = function (profile, grantedDescriptors, deniedDescriptors, config) {
                return this.transport.put('/api/access-profiles', {
                    Profile: profile,
                    Granted: grantedDescriptors,
                    Denied: deniedDescriptors
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.FeatureAccessProfile(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            AccessProfileService.prototype.archiveAccessProfile = function (profileId, config) {
                return this.transport.put('/api/access-profiles/archives', { Id: profileId }, config);
            };
            AccessProfileService.prototype.applyAccessProfile = function (userId, accessProfileCode, expiryDate, config) {
                return this.transport.put('/api/access-profiles/applications', {
                    UserId: userId,
                    Code: accessProfileCode,
                    ExpiryDate: expiryDate
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.UserAccessProfile(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            AccessProfileService.prototype.revokeAccessProfile = function (userId, accessProfileCode, config) {
                return this.transport.delete('/api/access-profiles', {
                    UserId: userId,
                    Code: accessProfileCode
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.UserAccessProfile(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            AccessProfileService.prototype.migrateAccessProfile = function (userId, oldAccessProfileCode, newAccessProfileCode, newExpiry, config) {
                return this.transport.delete('/api/access-profiles/migrations', {
                    UserId: userId,
                    OldAccessProfileCode: oldAccessProfileCode,
                    NewAccessProfileCode: newAccessProfileCode,
                    NewExpiry: newExpiry
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.UserAccessProfile(oprc.data.Result) : null;
                    return oprc.data;
                });
            };
            AccessProfileService.prototype.activeUserAccessProfiles = function (userId, config) {
                return this.transport.get('/api/access-profiles/active', {
                    UserId: userId
                }, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ?
                        oprc.data.Result.map(function (_r) { return new Gaia.Domain.UserAccessProfile(_r); }) : [];
                    return oprc.data;
                });
            };
            AccessProfileService.$inject = ["#gaia.utils.domainTransport"];
            return AccessProfileService;
        }());
        Services.AccessProfileService = AccessProfileService;
        var MarketPlaceService = (function () {
            function MarketPlaceService(transport, $q) {
                this.transport = transport;
                this.$q = $q;
            }
            ///Merchant
            MarketPlaceService.prototype.getProductCategories = function (config) {
                return this.transport.get('/api/market-place/merchants/product-categories', null, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ?
                        oprc.data.Result.map(function (_r) { return new Gaia.Domain.ProductCategory(_r); }) : [];
                    return oprc.data;
                });
            };
            MarketPlaceService.prototype.getServiceCategories = function (config) {
                return this.transport.get('/api/market-place/merchants/service-categories', null, config).then(function (oprc) {
                    oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ?
                        oprc.data.Result.map(function (_r) { return new Gaia.Domain.ServiceCategory(_r); }) : [];
                    return oprc.data;
                });
            };
            MarketPlaceService.prototype.findMerchantProducts = function (searchString, pageSize, pageIndex, config) {
                return this.transport.get('/api/market-place/merchant/products', {
                    SearchString: searchString,
                    PageIndex: pageIndex,
                    PageSize: pageSize
                }, config).then(function (oprc) {
                    if (Object.isNullOrUndefined(oprc.data.Result))
                        oprc.data.Result = new Gaia.Utils.SequencePage([], 0);
                    else
                        oprc.data.Result = new Gaia.Utils.SequencePage(oprc.data.Result.Page.map(function (_p) { return new Gaia.Domain.Product(_p); }), oprc.data.Result.SequenceLength, oprc.data.Result.PageSize, oprc.data.Result.PageIndex);
                    return oprc.data;
                });
            };
            MarketPlaceService.prototype.findMerchantServices = function (searchString, pageSize, pageIndex, config) {
                return this.transport.get('/api/market-place/merchant/services', {
                    SearchString: searchString,
                    PageIndex: pageIndex,
                    PageSize: pageSize
                }, config).then(function (oprc) {
                    if (Object.isNullOrUndefined(oprc.data.Result))
                        oprc.data.Result = new Gaia.Utils.SequencePage([], 0);
                    else
                        oprc.data.Result = new Gaia.Utils.SequencePage(oprc.data.Result.Page.map(function (_s) { return new Gaia.Domain.Service(_s); }), oprc.data.Result.SequenceLength, oprc.data.Result.PageSize, oprc.data.Result.PageIndex);
                    return oprc.data;
                });
                //return this.$q.resolve(new Utils.Operation<Utils.SequencePage<Domain.Service>>({
                //    Succeeded: true,
                //    Result: new Utils.SequencePage<Domain.Service>([new Domain.Service({
                //        TransactionId: '0000-0000000-0000',
                //        Title: 'Mega Man X',
                //        Description: 'the mega-est man alive',
                //        Status: Domain.ServiceStatus.Available,
                //        Cost: 49.99,
                //        ItemType: Domain.ItemType.Service,
                //        $nascent: true,
                //        Inputs: [],
                //        Outputs: []
                //    }), new Domain.Service({
                //        TransactionId: '0000-0000000-0000',
                //        Title: 'Trinidad',
                //        Description: 'battle of the worlds',
                //        Status: Domain.ServiceStatus.Suspended,
                //        Cost: 22.30,
                //        ItemType: Domain.ItemType.Service,
                //        Inputs: [],
                //        Outputs: []
                //    }), new Domain.Service({
                //        TransactionId: '0000-0000000-0000',
                //        Title: 'Drizzt',
                //        Description: 'dark elf drow race',
                //        Status: Domain.ServiceStatus.Unavailable,
                //        Cost: 85.99,
                //        ItemType: Domain.ItemType.Service,
                //        Inputs: [],
                //        Outputs: []
                //    })], 3)
                //}));
            };
            MarketPlaceService.prototype.getMerchantOrders = function (pageIndex, pageSize, config) {
                return this.transport.get('/api/market-place/merchants/orders', {
                    PageIndex: pageIndex,
                    PageSize: pageSize
                }, config).then(function (oprc) {
                    if (Object.isNullOrUndefined(oprc.data.Result))
                        oprc.data.Result = new Gaia.Utils.SequencePage([], 0);
                    else
                        oprc.data.Result = new Gaia.Utils.SequencePage(oprc.data.Result.Page.map(function (_o) { return new Gaia.Domain.Order(_o); }), oprc.data.Result.SequenceLength, oprc.data.Result.PageSize, oprc.data.Result.PageIndex);
                    return oprc.data;
                });
            };
            MarketPlaceService.prototype.modifyOrder = function (order, config) {
                return this.transport.put('/api/market-place/merchants/orders', order, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.fulfillOrder = function (order, config) {
                return this.transport.put('/api/market-place/merchants/orders/fulfilled', order, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.addService = function (service, config) {
                return this.transport.post('/api/market-place/merchants/services', service, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.modifyService = function (service, config) {
                return this.transport.put('/api/market-place/merchants/services', service, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.addServiceInterface = function (sinterface, config) {
                return this.transport.post('/api/market-place/merchants/services-interfaces', sinterface, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.addProduct = function (product, config) {
                return this.transport.post('/api/market-place/merchants/products', product, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.modifyProduct = function (product, config) {
                return this.transport.put('/api/market-place/merchants/products', product, config).then(function (opr) { return opr.data; });
            };
            ///end-Merchant
            /// Customer
            MarketPlaceService.prototype.findCustomerProduct = function (searchString, pageSize, pageIndex, config) {
                return this.transport.get('/api/market-place/customer/products', {
                    SearchString: searchString,
                    PageIndex: pageIndex,
                    PageSize: pageSize
                }, config).then(function (oprc) {
                    if (Object.isNullOrUndefined(oprc.data.Result))
                        oprc.data.Result = new Gaia.Utils.SequencePage([], 0);
                    else
                        oprc.data.Result = new Gaia.Utils.SequencePage(oprc.data.Result.Page.map(function (_p) { return new Gaia.Domain.Product(_p); }), oprc.data.Result.SequenceLength, oprc.data.Result.PageSize, oprc.data.Result.PageIndex);
                    return oprc.data;
                });
            };
            MarketPlaceService.prototype.findCustomerService = function (searchString, pageSize, pageIndex, config) {
                return this.transport.get('/api/market-place/customer/services', {
                    SearchString: searchString,
                    PageIndex: pageIndex,
                    PageSize: pageSize
                }, config).then(function (oprc) {
                    if (Object.isNullOrUndefined(oprc.data.Result))
                        oprc.data.Result = new Gaia.Utils.SequencePage([], 0);
                    else
                        oprc.data.Result = new Gaia.Utils.SequencePage(oprc.data.Result.Page.map(function (_s) { return new Gaia.Domain.Service(_s); }), oprc.data.Result.SequenceLength, oprc.data.Result.PageSize, oprc.data.Result.PageIndex);
                    return oprc.data;
                });
            };
            MarketPlaceService.prototype.getShoppingLists = function (config) {
                return this.transport.get('/api/merket-place/customer/shopping-list', null, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.addToBasket = function (itemId, type, config) {
                return this.transport.put('/api/merket-place/customer/cart', {
                    ItemId: itemId,
                    ItemType: type
                }, config);
            };
            MarketPlaceService.prototype.removeFromBasket = function (baskeItemId, config) {
                return this.transport.delete('/api/merket-place/customer/cart', {
                    ItemId: baskeItemId,
                }, config);
            };
            MarketPlaceService.prototype.addToList = function (listName, itemId, type, config) {
                return this.transport.put('/api/merket-place/customer/list', {
                    ItemId: itemId,
                    ItemType: type,
                    ListName: listName
                }, config);
            };
            MarketPlaceService.prototype.removeFromList = function (listName, itemId, config) {
                return this.transport.delete('/api/merket-place/customer/list', {
                    ItemId: itemId,
                    ListName: listName
                }, config);
            };
            MarketPlaceService.prototype.checkout = function (config) {
                return this.transport.post('/api/market-place/customer/cart/checkout', null, config).then(function (opr) { return opr.data; });
            };
            MarketPlaceService.prototype.getCustomerOrders = function (pageIndex, pageSize, config) {
                return this.transport.get('/api/market-place/customer/orders', {
                    PageIndex: pageIndex,
                    PageSize: pageSize
                }, config).then(function (oprc) {
                    if (Object.isNullOrUndefined(oprc.data.Result))
                        oprc.data.Result = new Gaia.Utils.SequencePage([], 0);
                    else
                        oprc.data.Result = new Gaia.Utils.SequencePage(oprc.data.Result.Page.map(function (_o) { return new Gaia.Domain.Order(_o); }), oprc.data.Result.SequenceLength, oprc.data.Result.PageSize, oprc.data.Result.PageIndex);
                    return oprc.data;
                });
            };
            ///end-Customer
            MarketPlaceService.$inject = ["#gaia.utils.domainTransport", '$q'];
            return MarketPlaceService;
        }());
        Services.MarketPlaceService = MarketPlaceService;
    })(Services = Gaia.Services || (Gaia.Services = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=gaia-services.js.map