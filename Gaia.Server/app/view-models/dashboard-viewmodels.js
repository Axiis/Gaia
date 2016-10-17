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
                    profileService.getBioData().then(function (oprc) { return _this.biodata = oprc.Result || new Axis.Pollux.Domain.BioData(); });
                    profileService.getContactData().then(function (oprc) { return _this.contact = oprc.Result.firstOrDefault() || new Axis.Pollux.Domain.ContactData(); });
                    profileService.getUserData().then(function (oprc) {
                        return _this.profileImage = oprc.Result
                            .filter(function (_ud) { return _ud.Name == 'ProfileImage'; })
                            .map(function (_ud) { return JSON.parse(_ud.Data); })
                            .firstOrDefault();
                    });
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
                    if (this.profileImage && this.profileImage.IsDataEmbeded)
                        return this.profileImage.EmbededDataUrl();
                    else if (this.profileImage)
                        this.profileImage.Data;
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
                DashboardViewModel.prototype.isFirstNameSet = function () {
                    if (this.biodata && this.biodata.FirstName)
                        return true;
                    else
                        return false;
                };
                DashboardViewModel.prototype.isLastNameSet = function () {
                    if (this.biodata && this.biodata.LastName)
                        return true;
                    else
                        return false;
                };
                Object.defineProperty(DashboardViewModel.prototype, "dobBinding", {
                    get: function () {
                        if (this.biodata && this.biodata.Dob)
                            return this.biodata.Dob.toMoment().toDate();
                        else
                            return null;
                    },
                    set: function (value) {
                        if (this.biodata) {
                            this.biodata.Dob = new Axis.Apollo.Domain.JsonDateTime().fromMoment(moment.utc(value));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
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
