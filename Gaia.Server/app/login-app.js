var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var Login;
        (function (Login) {
            Login.module = angular.module("gaiaLogin", ['ngRoute', 'ui.router']);
            Gaia.Utils.moduleConfig.addModule(Login.module);
            //configure states
            Login.module.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/signin');
                $stateProvider
                    .state('signin', {
                    url: '/signin',
                    templateUrl: 'signin',
                    controller: 'SigninViewModel'
                })
                    .state('signup', {
                    url: '/signup',
                    templateUrl: 'signup',
                    controller: 'SignUpViewModel'
                })
                    .state('passwordRecoveryRequest', {
                    url: '/recovery-request',
                    templateUrl: 'recovery-request',
                    controller: 'RecoveryRequestViewModel'
                })
                    .state('recoverPassword', {
                    url: '/recover/:recoveryToken',
                    templateUrl: 'recover-password',
                    controller: 'RecoverPasswordViewModel'
                });
            });
        })(Login = App.Login || (App.Login = {}));
    })(App = Gaia.App || (Gaia.App = {}));
})(Gaia || (Gaia = {}));
