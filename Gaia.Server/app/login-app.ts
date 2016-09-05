
module Gaia.App.Login {

    
    export const module = angular.module("gaiaLogin", ['ngRoute', 'ui.router']);
    Gaia.Utils.moduleConfig.addModule(module);

    //configure states
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/signin')

        $stateProvider
            .state('signin', {
                url: '/signin',
                templateUrl: 'signin', //<-- /view-server/signin
                controller: 'SigninViewModel'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup', //<-- /view-server/signup
                controller: 'SignUpViewModel'
            })
            .state('passwordRecoveryRequest', {
                url: '/recovery-request',
                templateUrl: 'recovery-request', //<-- /view-server/recovery-request
                controller: 'RecoveryRequestViewModel'
            })
            .state('recoverPassword', {
                url: '/recover/:recoveryToken',
                templateUrl: 'recover-password', //<-- /view-server/recover-password
                controller: 'RecoverPasswordViewModel'
            });
    });

}