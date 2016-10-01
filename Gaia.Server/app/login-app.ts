
module Gaia.App.Login {

    
    export const module = angular.module("gaiaLogin", ['ui.router', 'ngSanitize']);
    Gaia.Utils.moduleConfig.addModule(module);

    ///Gaia services
    module.service('#gaia.profileService', Gaia.Services.ProfileService);

    ///Pollux Services
    module.service('#pollux.authentication', Pollux.Services.Authentication);

    ///Util Services
    module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
    module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);


    //configure states
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/signin')

        $stateProvider
            .state('signin', {
                url: '/signin',
                templateUrl: 'signin', //<-- /view-server/signin
                controller: 'SigninViewModel',
                controllerAs: 'vm'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup', //<-- /view-server/signup
                controller: 'SignupViewModel',
                controllerAs: 'vm'
            })
            .state('passwordRecoveryRequest', {
                url: '/recovery-request',
                templateUrl: 'recovery-request', //<-- /view-server/recovery-request
                controller: 'RecoveryRequestViewModel',
                controllerAs: 'vm'
            })
            .state('recoverPassword', {
                url: '/recover/:recoveryToken',
                templateUrl: 'recover-password', //<-- /view-server/recover-password
                controller: 'RecoverPasswordViewModel',
                controllerAs: 'vm'
            })
            .state('message', {
                url: '/message/:back/:message',
                templateUrl: 'login-message', //<-- /view-server/account-message
                controller: 'MessageViewModel',
                controllerAs: 'vm'
            })
            .state('verifyRegistration', {
                url: '/verify-registration/:verificationToken/:user',
                templateUrl: 'verify-registration', //<-- /view-server/account-message
                controller: 'VerifyRegistrationViewModel',
                controllerAs: 'vm'
            });
    });

}