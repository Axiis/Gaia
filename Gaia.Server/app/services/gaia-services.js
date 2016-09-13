var Gaia;
(function (Gaia) {
    var Services;
    (function (Services) {
        var ProfileService = (function () {
            function ProfileService($http) {
                this.$http = $http;
            }
            ProfileService.prototype.registerUser = function () {
                return null;
            };
            ProfileService.prototype.registerAdminUser = function () {
                return null;
            };
            ProfileService.prototype.createRegistrationVerification = function () {
                return null;
            };
            ProfileService.prototype.verifyUserRegistration = function () {
                return null;
            };
            ProfileService.prototype.modifyBioData = function () {
                return null;
            };
            ProfileService.prototype.modifyContactData = function () {
                return null;
            };
            ProfileService.prototype.modifyCorporateData = function () {
                return null;
            };
            ProfileService.prototype.addData = function () {
                return null;
            };
            ProfileService.prototype.removeData = function () {
                return null;
            };
            ProfileService.prototype.archiveUser = function () {
                return null;
            };
            ProfileService.prototype.createActivationVerification = function () {
                return null;
            };
            ProfileService.prototype.verifyUserActivation = function () {
                return null;
            };
            ProfileService.$inject = ["$http"];
            return ProfileService;
        }());
        Services.ProfileService = ProfileService;
        Gaia.Utils.moduleConfig.withService('profileService', ProfileService); //<-- adds this service to all modules
    })(Services = Gaia.Services || (Gaia.Services = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=gaia-services.js.map