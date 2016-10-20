var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Dashboard;
        (function (Dashboard) {
            var DashboardViewModel = (function () {
                function DashboardViewModel(profileService, domModel, notifyService) {
                    this.profileService = profileService;
                    this.domModel = domModel;
                    this.notifyService = notifyService;
                    ///<<Profile>
                    this.isEditingBioData = false;
                    this.isEditingContactData = false;
                    this.isProfileImageChanged = false;
                    this.isPersistingProfileImage = false;
                    this.isRemovingProfileImage = false;
                    this.hasBiodataPersistenceError = false;
                    this.hasContactdataPersistenceError = false;
                    this.hasProfileImagePersistenceError = false;
                    this.user = null;
                    this.biodata = null;
                    this.contact = null;
                    ///<Profile Image Stuff>
                    this._originalImage = null;
                    this._profileImage = null;
                    ///</profile image stuff>
                    ///<Biodata stuff>
                    this.isPersistingBiodata = false;
                    /// <Biodata-stuff>
                    ///<contact stuff>
                    this.isPersistingContactdata = false;
                    /// </contact-stuff>
                    ///</Profile>
                    ///<Accounts>
                    ///<businesses>
                    this.businessList = [];
                    this.isListingBusinesses = true;
                    this.isEditingBusiness = false;
                    this.isDetailingBusiness = false;
                    this.currentBusinessData = null;
                    this.refreshBiodata();
                    this.refreshContactData();
                    this.refreshProfileImage();
                    this.user = new Axis.Pollux.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                }
                Object.defineProperty(DashboardViewModel.prototype, "profileImage", {
                    get: function () {
                        return this._profileImage;
                    },
                    set: function (value) {
                        this._profileImage = value;
                        this.isProfileImageChanged = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                DashboardViewModel.prototype.profileImageUrl = function () {
                    if (this.profileImage && this.profileImage.IsDataEmbeded)
                        return this.profileImage.EmbededDataUrl();
                    else if (this.profileImage)
                        this.profileImage.Data;
                    else
                        return '/content/images/default-image-200.jpg';
                };
                DashboardViewModel.prototype.removeProfileImage = function () {
                    var _this = this;
                    if (this.isProfileImageChanged) {
                        this.profileImage = this._originalImage;
                        this.isProfileImageChanged = false;
                    }
                    else {
                        if (this.isRemovingProfileImage)
                            return;
                        this.isRemovingProfileImage = true;
                        this.profileService.removeData(['ProfileImage'])
                            .then(function (oprc) {
                            _this.profileImage = _this._originalImage = null;
                            _this.isRemovingProfileImage = false;
                            _this.isProfileImageChanged = false;
                        }, function (e) {
                            _this.isRemovingProfileImage = false;
                            _this.hasProfileImagePersistenceError = true;
                        });
                    }
                };
                DashboardViewModel.prototype.persistProfileImage = function () {
                    var _this = this;
                    if (this.isPersistingProfileImage)
                        return;
                    this.isPersistingProfileImage = true;
                    this.profileService.removeData(['ProfileImage'])
                        .then(function (oprc) { return _this.profileService.addData([new Axis.Pollux.Domain.UserData({
                            Data: JSON.stringify(_this.profileImage),
                            Name: 'ProfileImage',
                            OwnerId: _this.user.UserId
                        })]).then(function (oprcx) {
                        _this.isPersistingProfileImage = false;
                        _this._originalImage = _this.profileImage;
                        _this.isProfileImageChanged = false;
                    }); }, function (e) {
                        _this.isPersistingProfileImage = false;
                        _this.hasProfileImagePersistenceError = true;
                    });
                };
                DashboardViewModel.prototype.refreshProfileImage = function () {
                    var _this = this;
                    this.profileService.getUserData().then(function (oprc) {
                        _this._originalImage = _this.profileImage = oprc.Result
                            .filter(function (_ud) { return _ud.Name == 'ProfileImage'; })
                            .map(function (_ud) { return new Axis.Luna.Domain.BinaryData(JSON.parse(_ud.Data)); })
                            .firstOrDefault();
                        _this.isProfileImageChanged = false;
                    });
                };
                DashboardViewModel.prototype.nameDisplay = function () {
                    if (this.biodata) {
                        var names = [];
                        names.push(this.biodata.LastName);
                        if (this.biodata.MiddleName)
                            names.push(this.biodata.MiddleName);
                        names.push(this.biodata.FirstName);
                        var ns = names.join(' ');
                        return ns.trim().length > 0 ? ns : '-N/A-';
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.dobDisplay = function () {
                    if (this.biodata && this.biodata.Dob) {
                        return this.biodata.Dob.toMoment().format('YYYY-MM-DD');
                    }
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.genderDisplay = function () {
                    if (this.biodata && this.biodata.Gender != null && this.biodata.Gender != undefined) {
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
                        return this._dobField;
                    },
                    set: function (value) {
                        if (this.biodata) {
                            this.biodata.Dob = new Axis.Apollo.Domain.JsonDateTime().fromMoment(moment.utc(value));
                            this._dobField = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                DashboardViewModel.prototype.persistBiodata = function () {
                    var _this = this;
                    if (this.isPersistingBiodata)
                        return;
                    this.isPersistingBiodata = true;
                    this.profileService.modifyBioData(this.biodata)
                        .then(function (oprc) {
                        _this.isEditingBioData = false;
                        _this.hasBiodataPersistenceError = false;
                        _this.isPersistingBiodata = false;
                    }, function (e) {
                        _this.hasBiodataPersistenceError = true;
                        _this.isPersistingBiodata = false;
                    });
                };
                DashboardViewModel.prototype.refreshBiodata = function () {
                    var _this = this;
                    this.profileService.getBioData().then(function (oprc) {
                        _this.biodata = oprc.Result || new Axis.Pollux.Domain.BioData();
                        _this._dobField = _this.biodata.Dob ? _this.biodata.Dob.toMoment().toDate() : null;
                    });
                };
                DashboardViewModel.prototype.phoneDisplay = function () {
                    if (this.contact && this.contact.Phone)
                        return this.contact.Phone;
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.alternatePhoneDisplay = function () {
                    if (this.contact && this.contact.AlternatePhone)
                        return this.contact.AlternatePhone;
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.emailDisplay = function () {
                    if (this.contact && this.contact.Email)
                        return this.contact.Email;
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.alternateEmailDisplay = function () {
                    if (this.contact && this.contact.AlternateEmail)
                        return this.contact.AlternateEmail;
                    else
                        return '-N/A-';
                };
                DashboardViewModel.prototype.persistContactData = function () {
                    var _this = this;
                    if (this.isPersistingContactdata)
                        return;
                    this.isPersistingContactdata = true;
                    this.profileService.modifyContactData(this.contact)
                        .then(function (oprc) {
                        _this.isEditingContactData = false;
                        _this.hasContactdataPersistenceError = false;
                        _this.isPersistingContactdata = false;
                    }, function (e) {
                        _this.hasContactdataPersistenceError = true;
                        _this.isPersistingContactdata = false;
                    });
                };
                DashboardViewModel.prototype.refreshContactData = function () {
                    var _this = this;
                    this.profileService.getContactData().then(function (oprc) {
                        _this.contact = oprc.Result.firstOrDefault() || new Axis.Pollux.Domain.ContactData({ Email: _this.user.UserId });
                    });
                };
                DashboardViewModel.prototype.clearBusinessView = function () {
                    this.isListingBusinesses = false;
                    this.isEditingBusiness = false;
                    this.isDetailingBusiness = false;
                };
                DashboardViewModel.prototype.getBusinessDescription = function (b) {
                    if (b) {
                        if (b.Description && b.Description.length > 200)
                            return b.Description.substr(0, 200) + '...';
                        else if (b.Description)
                            return b.Description;
                        else
                            return '';
                    }
                    else
                        return '';
                };
                DashboardViewModel.prototype.showBusinessDetails = function (b) {
                    if (b) {
                        this.currentBusinessData = b;
                        this.clearBusinessView();
                        this.isDetailingBusiness = true;
                    }
                };
                DashboardViewModel.prototype.addBusiness = function () {
                    var newobj = new Axis.Pollux.Domain.CorporateData();
                    newobj.$nascent = true;
                    this.businessList = [newobj].concat(this.businessList);
                };
                DashboardViewModel.prototype.editBusiness = function (b) {
                    if (b) {
                        this.currentBusinessData = b;
                        this.clearBusinessView();
                        this.isEditingBusiness = true;
                    }
                };
                DashboardViewModel.prototype.removeBusiness = function (b) {
                    var _this = this;
                    if (b && b.$nascent) {
                        this.businessList.remove(b);
                    }
                    else if (b && b.Status == Gaia.Utils.BusinessStatus_Draft) {
                        this.profileService.removeCorporateData([b.EntityId])
                            .then(function (oprc) {
                            _this.businessList.remove(b);
                            _this.notifyService.success('Business data removed successfully', 'Alert');
                        }, function (e) {
                            _this.notifyService.success('Something went wrong while removing your business data...', 'Oops!');
                        });
                    }
                };
                DashboardViewModel.prototype.persistBusiness = function (b) {
                    var _this = this;
                    if (b && b.Status == Gaia.Utils.BusinessStatus_Draft) {
                        this.profileService.modifyCorporateData(b)
                            .then(function (oprc) {
                            delete b.$nascent;
                            _this.notifyService.success('Business data was saved successfully', 'Alert');
                        }, function (e) {
                            _this.notifyService.success('Something went wrong while saving your business data...', 'Oops!');
                        });
                    }
                };
                DashboardViewModel.prototype.refreshBusinesss = function () {
                    var _this = this;
                    this.profileService.getCorporateData()
                        .then(function (oprc) {
                        _this.currentBusinessData = null;
                        _this.businessList = oprc.Result || [];
                    }, function (e) {
                    });
                };
                //</businesses>
                ///</Accounts>
                DashboardViewModel.$inject = ['#gaia.profileService', '#gaia.utils.domModel', '#gaia.utils.notify'];
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
