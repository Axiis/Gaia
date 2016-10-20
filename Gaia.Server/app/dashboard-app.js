var Gaia;
(function (Gaia) {
    var App;
    (function (App) {
        var Dashboard;
        (function (Dashboard) {
            Dashboard.module = angular.module("gaiaDashboard", ['ui.router', 'ngSanitize']);
            ///Gaia Directives
            Dashboard.module.directive('binaryData', Gaia.Directives.BinaryData);
            ///Gaia services
            Dashboard.module.service('#gaia.profileService', Gaia.Services.ProfileService);
            ///Pollux Services
            Dashboard.module.service('#pollux.authentication', Pollux.Services.Authentication);
            ///Util Services
            Dashboard.module.service('#gaia.utils.domainTransport', Gaia.Utils.Services.DomainTransport);
            Dashboard.module.service('#gaia.utils.domModel', Gaia.Utils.Services.DomModelService);
            Dashboard.module.service('#gaia.utils.notify', Gaia.Utils.Services.NotifyService);
            ///ViewModels
            Dashboard.module.controller('NavbarViewModel', Gaia.ViewModels.Shared.NavbarViewModel);
            Dashboard.module.controller('DashboardViewModel', Gaia.ViewModels.Dashboard.DashboardViewModel);
            Dashboard.module.controller('ProfileViewModel', Gaia.ViewModels.Dashboard.ProfileViewModel);
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
