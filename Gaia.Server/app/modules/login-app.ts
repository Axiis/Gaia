
module Gaia.App.Login {
    
    export const module = angular.module("gaiaLogin", ['ui.router', 'ngSanitize']);

    ///directives
    module.directive('boxLoader', () => new Gaia.Directives.BoxLoader());

    ///Gaia services
    module.service('#gaia.profileService', Gaia.Services.ProfileService);

    ///Pollux Services
    module.service('#pollux.authentication', Pollux.Services.Authentication);

    ///Util Services
    module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
    module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);

    ///ViewModels
    module.controller('SigninViewModel', Gaia.ViewModels.Login.Signin);
    module.controller('SignupViewModel', Gaia.ViewModels.Login.Signup);
    module.controller('RecoveryRequestViewModel', Gaia.ViewModels.Login.RecoveryRequest);
    module.controller('RecoverPasswordViewModel', Gaia.ViewModels.Login.RecoverPassword);
    module.controller('MessageViewModel', Gaia.ViewModels.Login.MessageViewModel);
    module.controller('VerifyRegistrationViewModel', Gaia.ViewModels.Login.VerifyRegistration);


    //configure states
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/signin')

        $stateProvider
            .state('signin', {
                url: '/signin',
                templateUrl: 'signin', //<-- /view-server/login/signin
                controller: 'SigninViewModel',
                controllerAs: 'vm'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup', //<-- /view-server/login/signup
                controller: 'SignupViewModel',
                controllerAs: 'vm'
            })
            .state('passwordRecoveryRequest', {
                url: '/recovery-request',
                templateUrl: 'recovery-request', //<-- /view-server/login/recovery-request
                controller: 'RecoveryRequestViewModel',
                controllerAs: 'vm'
            })
            .state('recoverPassword', {
                url: '/recover/:recoveryToken',
                templateUrl: 'recover-password', //<-- /view-server/login/recover-password
                controller: 'RecoverPasswordViewModel',
                controllerAs: 'vm'
            })
            .state('message', {
                url: '/message/:back/:message',
                templateUrl: 'login-message', //<-- /view-server/login/account-message
                controller: 'MessageViewModel',
                controllerAs: 'vm'
            })
            .state('verifyRegistration', {
                url: '/verify-registration/:verificationToken/:user/:emailDomain',
                templateUrl: 'verify-registration', //<-- /view-server/login/account-message
                controller: 'VerifyRegistrationViewModel',
                controllerAs: 'vm'
            });
    });

}