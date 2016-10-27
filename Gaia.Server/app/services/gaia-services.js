var Gaia;
(function (Gaia) {
    var Services;
    (function (Services) {
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
                return this.transport.get('/api/profiles/data', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_ud) { return new Axis.Pollux.Domain.UserData(_ud); }) : [];
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
                return this.transport.delete('/api/profiles/data/?dataNames=' + dataNames.join(','), null, config)
                    .then(function (oprc) { return oprc.data; });
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
            UserAccountService.prototype.getServiceAccounts = function (config) {
                return this.transport.get('/api/profiles/service-account', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Gaia.Domain.ServiceAccount(_cd); }) : null;
                    return oprc.data;
                });
            };
            UserAccountService.prototype.addServiceAccount = function (serviceAccount, config) {
                return this.transport.post('/api/profiles/service-account', serviceAccount, config).then(function (oprc) {
                    serviceAccount.EntityId = oprc.data.Result;
                });
            };
            UserAccountService.prototype.modifyServiceAccount = function (serviceAccount, config) {
                return this.transport.put('/api/profiles/service-account', serviceAccount, config).then(function (oprc) { });
            };
            UserAccountService.prototype.persistServiceAccount = function (data) {
                if (!data.EntityId || data.EntityId <= 0)
                    this.addServiceAccount(data);
                else
                    return this.modifyServiceAccount(data);
            };
            UserAccountService.prototype.removeServiceAccount = function (ids, config) {
                return this.transport.delete('/api/profiles/service-account/?ids=' + ids.join(','), null, config).then(function (oprc) { return oprc.data; });
            };
            UserAccountService.prototype.getFarmAccounts = function (config) {
                return this.transport.get('/api/profiles/farm-account', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Gaia.Domain.FarmAccount(_cd); }) : null;
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
            UserAccountService.prototype.persistFarmAccount = function (data) {
                if (!data.EntityId || data.EntityId <= 0)
                    this.addFarmAccount(data);
                else
                    return this.modifyFarmAccount(data);
            };
            UserAccountService.prototype.removeFarmAccount = function (ids, config) {
                return this.transport.delete('/api/profiles/farm-account/?ids=' + ids.join(','), null, config).then(function (oprc) { return oprc.data; });
            };
            UserAccountService.$inject = ["#gaia.utils.domainTransport"];
            return UserAccountService;
        }());
        Services.UserAccountService = UserAccountService;
    })(Services = Gaia.Services || (Gaia.Services = {}));
})(Gaia || (Gaia = {}));
