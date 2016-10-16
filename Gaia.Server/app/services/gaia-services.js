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
                }, config).then(function (oprc) { return oprc.data; });
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
                return this.transport.put('/api/profiles/bio-data', biodata, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.getContactData = function (config) {
                return this.transport.get('/api/profiles/contact-data', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Axis.Pollux.Domain.ContactData(_cd); }) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.modifyContactData = function (contactData, config) {
                return this.transport.put('/api/profiles/contact-data', contactData, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.prototype.getCorporateData = function (config) {
                return this.transport.get('/api/profiles/corporate-data', null, config).then(function (oprc) {
                    oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(function (_cd) { return new Axis.Pollux.Domain.CorporateData(_cd); }) : null;
                    return oprc.data;
                });
            };
            ProfileService.prototype.modifyCorporateData = function (corporateData, config) {
                return this.transport.put('/api/profiles/corporate-data', corporateData, config).then(function (oprc) { return oprc.data; });
            };
            ProfileService.$inject = ["#gaia.utils.domainTransport"];
            return ProfileService;
        }());
        Services.ProfileService = ProfileService;
    })(Services = Gaia.Services || (Gaia.Services = {}));
})(Gaia || (Gaia = {}));
