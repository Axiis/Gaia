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
                    this.profileImage = null;
                    profileService.getBioData().then(function (oprc) { return _this.biodata = oprc.Result; });
                    profileService.getContactData().then(function (oprc) { return _this.contact = oprc.Result.firstOrDefault(); });
                    this.user = new Axis.Pollux.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                }
                ///Biodata stuff
                DashboardViewModel.prototype.nameDisplay = function () {
                    if (this.biodata) {
                        var names = [];
                        names.push(this.biodata.LastName);
                        if (this.biodata.MiddleName)
                            names.push(this.biodata.MiddleName);
                        names.push(this.biodata.FirstName);
                        return names.join(' ');
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.profileImageUrl = function () {
                    if (this.profileImage && this.profileImage.Data)
                        return this.profileImage.DataUrl();
                    else if (this.profileImage && this.profileImage.Address)
                        this.profileImage.Address;
                    else
                        return '';
                };
                DashboardViewModel.prototype.dobDisplay = function () {
                    if (this.biodata && this.biodata.Dob) {
                        return this.biodata.Dob.toMoment().format('YYYY-MM-DD');
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.genderDisplay = function () {
                    if (this.biodata && this.biodata.Gender) {
                        return Axis.Pollux.Domain.Gender[this.biodata.Gender];
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.nationalityDisplay = function () {
                    if (this.biodata && this.biodata.Nationality) {
                        return this.biodata.Nationality;
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.stateOfOriginDisplay = function () {
                    if (this.biodata && this.biodata.StateOfOrigin) {
                        return this.biodata.StateOfOrigin;
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.persistBioData = function () {
                    return null;
                };
                /// end-biodata-stuff
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
