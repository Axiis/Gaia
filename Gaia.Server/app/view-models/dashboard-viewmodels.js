var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Dashboard;
        (function (Dashboard) {
            var DashboardViewModel = (function () {
                function DashboardViewModel(profileService, domModel) {
                    var _this = this;
                    this.profileService = profileService;
                    this.domModel = domModel;
                    ///Profile
                    this.isEditingBioData = false;
                    this.isEditingContactData = false;
                    this.user = null;
                    this.biodata = null;
                    this.contact = null;
                    profileService.getBioData().success(function (oprc) { return _this.biodata = oprc.Result; });
                    profileService.getContactData().success(function (oprc) { return _this.contact = oprc.Result.firstOrDefault(); });
                    this.user = new Gaia.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                }
                DashboardViewModel.prototype.names = function () {
                    return null;
                };
                DashboardViewModel.prototype.profileImageUrl = function () {
                    return null;
                };
                DashboardViewModel.prototype.dobInfo = function () {
                };
                DashboardViewModel.prototype.persistBioData = function () {
                    return null;
                };
                DashboardViewModel.prototype.persistContactData = function () {
                    return null;
                };
                /// end-Profile
                DashboardViewModel.$inject = ['#gaia.profileService', '#gaia.utils.domModel'];
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
