
module Gaia.App.Dashboard {

    export const module = angular.module("gaiaDashboard", ['ui.router', 'ngSanitize']);

    ///Gaia Directives
    module.directive('binaryData', Gaia.Directives.BinaryData);

    ///Gaia services
    module.service('#gaia.profileService', Gaia.Services.ProfileService);
    module.service('#gaia.accountsService', Gaia.Services.UserAccountService);

    ///Pollux Services
    module.service('#pollux.authentication', Pollux.Services.Authentication);

    ///Util Services
    module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
    module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);
    module.service('#gaia.utils.notify', Gaia.Utils.Services.NotifyService);

    module.service('#gaia.dashboard.localServices.AccountCounter', Gaia.ViewModels.Dashboard.AccountCounter);

    ///ViewModels
    module.controller('NavbarViewModel', Gaia.ViewModels.Shared.NavbarViewModel);
    module.controller('DashboardViewModel', Gaia.ViewModels.Dashboard.DashboardViewModel);
    module.controller('ProfileViewModel', Gaia.ViewModels.Dashboard.ProfileViewModel);
    module.controller('BusinessAccountViewModel', Gaia.ViewModels.Dashboard.BusinessAccountViewModel);
    module.controller('ServiceAccountViewModel', Gaia.ViewModels.Dashboard.ServiceAccountViewModel);
    module.controller('FarmAccountViewModel', Gaia.ViewModels.Dashboard.FarmAccountViewModel);
    module.controller('AccountTabsViewModel', Gaia.ViewModels.Dashboard.AccountTabsViewModel);


    //configure states
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/dashboard')

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard', //<-- /view-server/secured/dashboard/dashboard
                controller: 'DashboardViewModel',
                controllerAs: 'vm'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile', //<-- /view-server/secured/dashboard/profile
                controller: 'ProfileViewModel',
                controllerAs: 'vm'
            });
    });

}