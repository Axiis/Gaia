var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var Login;
        (function (Login) {
            Login.module = angular.module("gaiaLogin", ['ngRoute', 'ui.router', 'ngSanitize']);
            Gaia.Utils.moduleConfig.addModule(Login.module);
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
//# sourceMappingURL=login-app.js.map