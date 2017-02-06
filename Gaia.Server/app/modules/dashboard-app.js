var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var Dashboard;
        (function (Dashboard) {
            Dashboard.module = angular.module("gaiaDashboard", ['ui.router', 'ngSanitize']);
            ///Gaia Directives
            Dashboard.module.directive('binaryData', Gaia.Directives.BinaryData);
            Dashboard.module.directive('enumOptions', function () { return new Gaia.Directives.EnumOptions(); });
            Dashboard.module.directive('ringLoader', function () { return new Gaia.Directives.RingLoader(); });
            Dashboard.module.directive('boxLoader', function () { return new Gaia.Directives.BoxLoader(); });
            ///Gaia services
            Dashboard.module.service('#gaia.profileService', Gaia.Services.ProfileService);
            Dashboard.module.service('#gaia.accountsService', Gaia.Services.UserAccountService);
            Dashboard.module.service('#gaia.accessProfileService', Gaia.Services.AccessProfileService);
            ///Pollux Services
            Dashboard.module.service('#pollux.authentication', Pollux.Services.Authentication);
            ///Util Services
            Dashboard.module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
            Dashboard.module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);
            Dashboard.module.service('#gaia.utils.notify', Gaia.Utils.Services.NotifyService);
            Dashboard.module.service('#gaia.dashboard.localServices.AccountCounter', Gaia.ViewModels.Dashboard.AccountCounter);
            ///ViewModels
            Dashboard.module.controller('NavbarViewModel', Gaia.ViewModels.Shared.NavbarViewModel);
            Dashboard.module.controller('DashboardViewModel', Gaia.ViewModels.Dashboard.DashboardViewModel);
            Dashboard.module.controller('ProfileViewModel', Gaia.ViewModels.Dashboard.ProfileViewModel);
            Dashboard.module.controller('BusinessAccountViewModel', Gaia.ViewModels.Dashboard.BusinessAccountViewModel);
            Dashboard.module.controller('FarmAccountViewModel', Gaia.ViewModels.Dashboard.FarmAccountViewModel);
            Dashboard.module.controller('AccountTabsViewModel', Gaia.ViewModels.Dashboard.AccountTabsViewModel);
            Dashboard.module.controller('ProfileViewModel', Gaia.ViewModels.Dashboard.ProfileViewModel);
            Dashboard.module.controller('UserAccountViewModel', Gaia.ViewModels.Dashboard.UserAccountViewModel);
            //configure states
            Dashboard.module.config(function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/dashboard');
                $stateProvider
                    .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'dashboard',
                    controller: 'DashboardViewModel',
                    controllerAs: 'vm'
                })
                    .state('profile', {
                    url: '/profile',
                    templateUrl: 'profile',
                    controller: 'ProfileViewModel',
                    controllerAs: 'vm'
                });
            });
        })(Dashboard = App.Dashboard || (App.Dashboard = {}));
    })(App = Gaia.App || (Gaia.App = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=dashboard-app.js.map