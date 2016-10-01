var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var Login;
        (function (Login) {
            Login.module = angular.module("gaiaLogin", ['ui.router', 'ngSanitize']);
            Gaia.Utils.moduleConfig.addModule(Login.module);
            ///Gaia services
            Login.module.service('#gaia.profileService', Gaia.Services.ProfileService);
            ///Pollux Services
            Login.module.service('#pollux.authentication', Pollux.Services.Authentication);
            ///Util Services
            Login.module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
            Login.module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);
            //configure states
            Login.module.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/signin');
                $stateProvider
                    .state('signin', {
                    url: '/signin',
                    templateUrl: 'signin',
                    controller: 'SigninViewModel',
                    controllerAs: 'vm'
                })
                    .state('signup', {
                    url: '/signup',
                    templateUrl: 'signup',
                    controller: 'SignupViewModel',
                    controllerAs: 'vm'
                })
                    .state('passwordRecoveryRequest', {
                    url: '/recovery-request',
                    templateUrl: 'recovery-request',
                    controller: 'RecoveryRequestViewModel',
                    controllerAs: 'vm'
                })
                    .state('recoverPassword', {
                    url: '/recover/:recoveryToken',
                    templateUrl: 'recover-password',
                    controller: 'RecoverPasswordViewModel',
                    controllerAs: 'vm'
                })
                    .state('message', {
                    url: '/message/:back/:message',
                    templateUrl: 'login-message',
                    controller: 'MessageViewModel',
                    controllerAs: 'vm'
                })
                    .state('verifyRegistration', {
                    url: '/verify-registration/:verificationToken/:user',
                    templateUrl: 'verify-registration',
                    controller: 'VerifyRegistrationViewModel',
                    controllerAs: 'vm'
                });
            });
        })(Login = App.Login || (App.Login = {}));
    })(App = Gaia.App || (Gaia.App = {}));
})(Gaia || (Gaia = {}));
