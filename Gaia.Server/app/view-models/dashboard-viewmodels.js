var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Dashboard;
        (function (Dashboard) {
            var DashboardViewModel = (function () {
                function DashboardViewModel() {
                    this.isEditingBioData = false;
                    this.isEditingContactData = false;
                    this.isEditingSecurityData = false;
                    this.user = null;
                    this.biodata = null;
                    this.contact = null;
                }
                DashboardViewModel.prototype.names = function () {
                    return null;
                };
                DashboardViewModel.prototype.persistBioData = function () {
                    return null;
                };
                DashboardViewModel.prototype.persistContactData = function () {
                    return null;
                };
                DashboardViewModel.$inject = [];
                return DashboardViewModel;
            }());
            Dashboard.DashboardViewModel = DashboardViewModel;
            var ProfileViewModel = (function () {
                function ProfileViewModel() {
                }
                return ProfileViewModel;
            }());
            Dashboard.ProfileViewModel = ProfileViewModel;
        })(Dashboard = ViewModels.Dashboard || (ViewModels.Dashboard = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
