var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Dashboard;
        (function (Dashboard) {
            var DashboardViewModel = (function () {
                function DashboardViewModel() {
                }
                return DashboardViewModel;
            }());
            Dashboard.DashboardViewModel = DashboardViewModel;
            var ProfileViewModel = (function () {
                function ProfileViewModel(profileService, domModel, notifyService) {
                    this.profileService = profileService;
                    this.domModel = domModel;
                    this.notifyService = notifyService;
                    this.user = null;
                    ///<<Profile>
                    this.isEditingBioData = false;
                    this.isEditingContactData = false;
                    this.isProfileImageChanged = false;
                    this.isPersistingProfileImage = false;
                    this.isRemovingProfileImage = false;
                    this.hasBiodataPersistenceError = false;
                    this.hasContactdataPersistenceError = false;
                    this.hasProfileImagePersistenceError = false;
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
                    this.refreshBiodata();
                    this.refreshContactData();
                    this.refreshProfileImage();
                    this.user = new Axis.Pollux.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                }
                Object.defineProperty(ProfileViewModel.prototype, "profileImage", {
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
                ProfileViewModel.prototype.profileImageUrl = function () {
                    if (this.profileImage && this.profileImage.IsDataEmbeded)
                        return this.profileImage.EmbededDataUrl();
                    else if (this.profileImage)
                        this.profileImage.Data;
                    else
                        return '/content/images/default-image-200.jpg';
                };
                ProfileViewModel.prototype.removeProfileImage = function () {
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
                            _this.notifyService.error('Something went wrong while removing your profile image...', 'Oops!');
                        });
                    }
                };
                ProfileViewModel.prototype.persistProfileImage = function () {
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
                        _this.notifyService.error('Something went wrong while saving your profile image...', 'Oops!');
                    });
                };
                ProfileViewModel.prototype.refreshProfileImage = function () {
                    var _this = this;
                    this.profileService.getUserData().then(function (oprc) {
                        _this._originalImage = _this.profileImage = oprc.Result
                            .filter(function (_ud) { return _ud.Name == 'ProfileImage'; })
                            .map(function (_ud) { return new Axis.Luna.Domain.BinaryData(JSON.parse(_ud.Data)); })
                            .firstOrDefault();
                        _this.isProfileImageChanged = false;
                    });
                };
                ProfileViewModel.prototype.nameDisplay = function () {
                    if (this.biodata) {
                        var names = [];
                        names.push(this.biodata.LastName);
                        if (this.biodata.MiddleName)
                            names.push(this.biodata.MiddleName);
                        names.push(this.biodata.FirstName);
                        var ns = names.join(' ');
                        return ns.trim().length > 0 ? ns : '--';
                    }
                    else
                        return '--';
                };
                ProfileViewModel.prototype.dobDisplay = function () {
                    if (this.biodata && this.biodata.Dob) {
                        return this.biodata.Dob.toMoment().format('Do MMM, YYYY');
                    }
                    else
                        return '--';
                };
                ProfileViewModel.prototype.genderDisplay = function () {
                    if (this.biodata && this.biodata.Gender != null && this.biodata.Gender != undefined) {
                        return Axis.Pollux.Domain.Gender[this.biodata.Gender];
                    }
                    else
                        return '--';
                };
                ProfileViewModel.prototype.nationalityDisplay = function () {
                    if (this.biodata && this.biodata.Nationality) {
                        return this.biodata.Nationality;
                    }
                    else
                        return '--';
                };
                ProfileViewModel.prototype.stateOfOriginDisplay = function () {
                    if (this.biodata && this.biodata.StateOfOrigin) {
                        return this.biodata.StateOfOrigin;
                    }
                    else
                        return '--';
                };
                ProfileViewModel.prototype.isFirstNameSet = function () {
                    if (this.biodata && this.biodata.FirstName)
                        return true;
                    else
                        return false;
                };
                ProfileViewModel.prototype.isLastNameSet = function () {
                    if (this.biodata && this.biodata.LastName)
                        return true;
                    else
                        return false;
                };
                Object.defineProperty(ProfileViewModel.prototype, "dobBinding", {
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
                ProfileViewModel.prototype.persistBiodata = function () {
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
                        _this.notifyService.error('Something went wrong while saving your Bio data...', 'Oops!');
                    });
                };
                ProfileViewModel.prototype.refreshBiodata = function () {
                    var _this = this;
                    this.profileService.getBioData().then(function (oprc) {
                        _this.biodata = oprc.Result || new Axis.Pollux.Domain.BioData();
                        _this._dobField = _this.biodata.Dob ? _this.biodata.Dob.toMoment().toDate() : null;
                    });
                };
                ProfileViewModel.prototype.phoneDisplay = function () {
                    if (this.contact && this.contact.Phone)
                        return this.contact.Phone;
                    else
                        return '--';
                };
                ProfileViewModel.prototype.alternatePhoneDisplay = function () {
                    if (this.contact && this.contact.AlternatePhone)
                        return this.contact.AlternatePhone;
                    else
                        return '--';
                };
                ProfileViewModel.prototype.emailDisplay = function () {
                    if (this.contact && this.contact.Email)
                        return this.contact.Email;
                    else
                        return '--';
                };
                ProfileViewModel.prototype.alternateEmailDisplay = function () {
                    if (this.contact && this.contact.AlternateEmail)
                        return this.contact.AlternateEmail;
                    else
                        return '--';
                };
                ProfileViewModel.prototype.persistContactData = function () {
                    var _this = this;
                    if (this.isPersistingContactdata)
                        return;
                    this.isPersistingContactdata = true;
                    this.profileService.persistContactData(this.contact)
                        .then(function (oprc) {
                        _this.isEditingContactData = false;
                        _this.hasContactdataPersistenceError = false;
                        _this.isPersistingContactdata = false;
                    }, function (e) {
                        _this.hasContactdataPersistenceError = true;
                        _this.isPersistingContactdata = false;
                        _this.notifyService.error('Something went wrong while saving your Contact data...', 'Oops!');
                    });
                };
                ProfileViewModel.prototype.refreshContactData = function () {
                    var _this = this;
                    this.profileService.getContactData().then(function (oprc) {
                        _this.contact = oprc.Result.firstOrDefault() || new Axis.Pollux.Domain.ContactData({ Email: _this.user.UserId });
                    });
                };
                /// </contact-stuff>
                ///</Profile>
                ProfileViewModel.$inject = ['#gaia.profileService', '#gaia.utils.domModel', '#gaia.utils.notify'];
                return ProfileViewModel;
            }());
            Dashboard.ProfileViewModel = ProfileViewModel;
            var BusinessAccountViewModel = (function () {
                function BusinessAccountViewModel(profileService, domModel, notifyService, counter) {
                    this.profileService = profileService;
                    this.domModel = domModel;
                    this.notifyService = notifyService;
                    this.user = null;
                    this.businessList = [];
                    this.currentBusinessData = null;
                    this.isListingBusinesses = true;
                    this.isEditingBusiness = false;
                    this.isPersistingBusiness = false;
                    this.isDetailingBusiness = false;
                    this.hasBusinessPersistenceError = false;
                    counter.businessVm = this;
                    this.refreshBusinesss();
                    this.user = new Axis.Pollux.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                }
                Object.defineProperty(BusinessAccountViewModel.prototype, "businessIncorporationDateBinding", {
                    get: function () {
                        return this._incorporationDate;
                    },
                    set: function (value) {
                        if (this.currentBusinessData) {
                            this.currentBusinessData.IncorporationDate = new Axis.Apollo.Domain.JsonDateTime().fromMoment(moment.utc(value));
                            this._incorporationDate = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                BusinessAccountViewModel.prototype.isDraft = function (business) {
                    if (business)
                        return business.Status == Gaia.Utils.BusinessStatus_Draft;
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.isRejected = function (business) {
                    if (business)
                        return business.Status == Gaia.Utils.BusinessStatus_Rejected;
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.isVerified = function (business) {
                    if (business)
                        return business.Status == Gaia.Utils.BusinessStatus_Verified;
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.isVerifying = function (business) {
                    if (business)
                        return business.Status == Gaia.Utils.BusinessStatus_Verifying;
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.isBusinessNameSet = function () {
                    if (this.currentBusinessData && this.currentBusinessData.CorporateName) {
                        return this.currentBusinessData.CorporateName.length > 0;
                    }
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.isBusinessIdSet = function () {
                    if (this.currentBusinessData && this.currentBusinessData.CorporateId) {
                        return this.currentBusinessData.CorporateId.length > 0;
                    }
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.isBusinessIncorporationDateSet = function () {
                    if (this.currentBusinessData && this.currentBusinessData.IncorporationDate)
                        return true;
                    else
                        return false;
                };
                BusinessAccountViewModel.prototype.backToListingBusinesses = function () {
                    if (this.currentBusinessData['$nascent']) {
                        this.businessList.remove(this.currentBusinessData);
                        this.currentBusinessData = null;
                    }
                    this.clearBusinessView();
                    this.isListingBusinesses = true;
                };
                BusinessAccountViewModel.prototype.clearBusinessView = function () {
                    this.isListingBusinesses = false;
                    this.isEditingBusiness = false;
                    this.isDetailingBusiness = false;
                };
                BusinessAccountViewModel.prototype.getBusinessDescription = function (b) {
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
                BusinessAccountViewModel.prototype.showBusinessDetails = function (b) {
                    if (b) {
                        this.currentBusinessData = b;
                        this.clearBusinessView();
                        this.isDetailingBusiness = true;
                    }
                };
                BusinessAccountViewModel.prototype.addBusiness = function () {
                    var newobj = new Axis.Pollux.Domain.CorporateData({ OwnerId: this.user.EntityId });
                    newobj.$nascent = true;
                    this.businessList = [newobj].concat(this.businessList);
                    return newobj;
                };
                BusinessAccountViewModel.prototype.addAndEditBusiness = function () {
                    this.editBusiness(this.addBusiness());
                };
                BusinessAccountViewModel.prototype.editBusiness = function (b) {
                    if (b) {
                        this.currentBusinessData = b;
                        this.clearBusinessView();
                        this.isEditingBusiness = true;
                        $('#richtext-editor').summernote('code', this.currentBusinessData.Description || '');
                    }
                };
                BusinessAccountViewModel.prototype.removeBusiness = function (b) {
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
                            _this.notifyService.error('Something went wrong while removing your business data...', 'Oops!');
                        });
                    }
                };
                BusinessAccountViewModel.prototype.persistCurrentBusinessData = function () {
                    if (this.currentBusinessData) {
                        this.currentBusinessData.Description = $('#richtext-editor').summernote('code');
                        this.persistBusiness(this.currentBusinessData);
                    }
                };
                BusinessAccountViewModel.prototype.persistBusiness = function (b) {
                    var _this = this;
                    if (b && b.Status == Gaia.Utils.BusinessStatus_Draft) {
                        if (!this.isPersistingBusiness) {
                            this.isPersistingBusiness = true;
                            this.profileService.persistCorporateData(b)
                                .then(function (oprc) {
                                delete b.$nascent;
                                _this.notifyService.success('Business data was saved successfully', 'Alert');
                                _this.isPersistingBusiness = false;
                            }, function (e) {
                                _this.notifyService.error('Something went wrong while saving your business data...', 'Oops!');
                                _this.isPersistingBusiness = false;
                            });
                        }
                    }
                };
                BusinessAccountViewModel.prototype.refreshBusinesss = function () {
                    var _this = this;
                    this.profileService.getCorporateData()
                        .then(function (oprc) {
                        _this.currentBusinessData = null;
                        _this.businessList = oprc.Result || [];
                    }, function (e) {
                        _this.notifyService.error('Something went wrong while retrieving your business data...', 'Oops!');
                    });
                };
                BusinessAccountViewModel.prototype.displayDate = function (date) {
                    if (date)
                        return date.toMoment().format('Do MMM, YYYY');
                    else
                        return '';
                };
                BusinessAccountViewModel.$inject = ['#gaia.profileService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
                return BusinessAccountViewModel;
            }());
            Dashboard.BusinessAccountViewModel = BusinessAccountViewModel;
            var ServiceAccountViewModel = (function () {
                function ServiceAccountViewModel(accountService, domModel, notifyService, counter) {
                    this.accountService = accountService;
                    this.domModel = domModel;
                    this.notifyService = notifyService;
                    this.user = null;
                    this.serviceList = [];
                    this.currentService = null;
                    this.serviceCategories = [];
                    this.isListingServices = true;
                    this.isEditingService = false;
                    this.isPersistingService = false;
                    this.isDetailingService = false;
                    this.hasServicePersistenceError = false;
                    counter.serviceVm = this;
                    this.refreshServices();
                    this.user = new Axis.Pollux.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                    this.serviceCategories = Object
                        .keys(Gaia.Domain.ServiceType)
                        .map(function (k) { return Gaia.Domain.ServiceType[k]; })
                        .filter(function (v) { return typeof v === "string"; });
                }
                Object.defineProperty(ServiceAccountViewModel.prototype, "selectedServiceCategory", {
                    get: function () {
                        if (this.currentService && !Object.isNullOrUndefined(this.currentService.ServiceType))
                            return Gaia.Domain.ServiceType[this.currentService.ServiceType];
                        else
                            return 'Not Selected';
                    },
                    enumerable: true,
                    configurable: true
                });
                ServiceAccountViewModel.prototype.clearUI = function () {
                    this.isListingServices = this.isEditingService = this.isPersistingService = this.hasServicePersistenceError = false;
                };
                ServiceAccountViewModel.prototype.backToListingServices = function () {
                    if (this.currentService['$nascent']) {
                        this.serviceList.remove(this.currentService);
                        this.currentService = null;
                    }
                    this.clearUI();
                    this.isListingServices = true;
                };
                ServiceAccountViewModel.prototype.serviceCategory = function (service) {
                    if (!Object.isNullOrUndefined(service) && !Object.isNullOrUndefined(service.ServiceType))
                        return Gaia.Domain.ServiceType[service.ServiceType];
                    else
                        return '';
                };
                ServiceAccountViewModel.prototype.selectCategory = function (type) {
                    if (this.currentService) {
                        this.currentService.ServiceType = Gaia.Domain.ServiceType[type];
                    }
                };
                ServiceAccountViewModel.prototype.addService = function () {
                    var newobj = new Gaia.Domain.ServiceAccount({ OwnerId: this.user.EntityId });
                    newobj.$nascent = true;
                    this.serviceList = [newobj].concat(this.serviceList);
                    return newobj;
                };
                ServiceAccountViewModel.prototype.addAndEditService = function () {
                    this.editService(this.addService());
                };
                ServiceAccountViewModel.prototype.editService = function (s) {
                    if (s) {
                        this.currentService = s;
                        this.clearUI();
                        this.isEditingService = true;
                        $('#services-richtext-editor').summernote('code', this.currentService.Description || '');
                    }
                };
                ServiceAccountViewModel.prototype.showServiceDetails = function (s) {
                    if (!Object.isNullOrUndefined(s)) {
                        this.currentService = s;
                        this.clearUI();
                        this.isDetailingService = true;
                    }
                };
                ServiceAccountViewModel.prototype.getServiceDescription = function (s) {
                    if (!Object.isNullOrUndefined(s)) {
                        if (s.Description && s.Description.length > 200)
                            return s.Description.substr(0, 200) + '...';
                        else if (s.Description)
                            return s.Description;
                        else
                            return '';
                    }
                    else
                        return '';
                };
                ServiceAccountViewModel.prototype.persistCurrentService = function () {
                    if (this.currentService) {
                        this.currentService.Description = $('#services-richtext-editor').summernote('code');
                        this.persistService(this.currentService);
                    }
                };
                ServiceAccountViewModel.prototype.persistService = function (service) {
                    var _this = this;
                    if (this.isPersistingService)
                        return;
                    this.isPersistingService = true;
                    this.accountService.persistServiceAccount(service)
                        .then(function (oprc) {
                        delete service.$nascent;
                        _this.notifyService.success('Your service account information was saved successfully', 'Alert');
                        _this.isPersistingService = false;
                    }, function (e) {
                        _this.notifyService.error('Something went wrong while saving your service account information...', 'Oops!');
                        _this.isPersistingService = false;
                    });
                };
                ServiceAccountViewModel.prototype.refreshServices = function () {
                    var _this = this;
                    this.accountService.getServiceAccounts().then(function (oprc) {
                        _this.serviceList = oprc.Result || [];
                    });
                };
                ServiceAccountViewModel.$inject = ['#gaia.accountsService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
                return ServiceAccountViewModel;
            }());
            Dashboard.ServiceAccountViewModel = ServiceAccountViewModel;
            var FarmAccountViewModel = (function () {
                function FarmAccountViewModel(accountFarm, domModel, notifyFarm, counter) {
                    this.accountFarm = accountFarm;
                    this.domModel = domModel;
                    this.notifyFarm = notifyFarm;
                    this.user = null;
                    this.farmList = [];
                    this.currentFarm = null;
                    this.farmCategories = [];
                    this.isListingFarms = true;
                    this.isEditingFarm = false;
                    this.isPersistingFarm = false;
                    this.isDetailingFarm = false;
                    this.hasFarmPersistenceError = false;
                    counter.farmVm = this;
                    this.refreshFarms();
                    this.user = new Axis.Pollux.Domain.User({
                        UserId: domModel.simpleModel.UserId,
                        EntityId: domModel.simpleModel.UserId,
                        Stataus: 1
                    });
                    this.farmCategories = Object
                        .keys(Gaia.Domain.FarmType)
                        .map(function (k) { return Gaia.Domain.FarmType[k]; })
                        .filter(function (v) { return typeof v === "string"; });
                }
                Object.defineProperty(FarmAccountViewModel.prototype, "selectedFarmCategory", {
                    get: function () {
                        if (this.currentFarm && !Object.isNullOrUndefined(this.currentFarm.FarmType))
                            return Gaia.Domain.FarmType[this.currentFarm.FarmType];
                        else
                            return 'Not Selected';
                    },
                    enumerable: true,
                    configurable: true
                });
                FarmAccountViewModel.prototype.clearUI = function () {
                    this.isListingFarms = this.isEditingFarm = this.isPersistingFarm = this.hasFarmPersistenceError = false;
                };
                FarmAccountViewModel.prototype.backToListingFarms = function () {
                    if (this.currentFarm['$nascent']) {
                        this.farmList.remove(this.currentFarm);
                        this.currentFarm = null;
                    }
                    this.clearUI();
                    this.isListingFarms = true;
                };
                FarmAccountViewModel.prototype.farmCategory = function (farm) {
                    if (!Object.isNullOrUndefined(farm) && !Object.isNullOrUndefined(farm.FarmType))
                        return Gaia.Domain.FarmType[farm.FarmType];
                    else
                        return '';
                };
                FarmAccountViewModel.prototype.selectCategory = function (type) {
                    if (this.currentFarm) {
                        this.currentFarm.FarmType = Gaia.Domain.FarmType[type];
                    }
                };
                FarmAccountViewModel.prototype.addFarm = function () {
                    var newobj = new Gaia.Domain.FarmAccount({ OwnerId: this.user.EntityId });
                    newobj.$nascent = true;
                    this.farmList = [newobj].concat(this.farmList);
                    return newobj;
                };
                FarmAccountViewModel.prototype.addAndEditFarm = function () {
                    this.editFarm(this.addFarm());
                };
                FarmAccountViewModel.prototype.editFarm = function (s) {
                    if (s) {
                        this.currentFarm = s;
                        this.clearUI();
                        this.isEditingFarm = true;
                        $('#farms-richtext-editor').summernote('code', this.currentFarm.Description || '');
                    }
                };
                FarmAccountViewModel.prototype.showFarmDetails = function (s) {
                    if (!Object.isNullOrUndefined(s)) {
                        this.currentFarm = s;
                        this.clearUI();
                        this.isDetailingFarm = true;
                    }
                };
                FarmAccountViewModel.prototype.getFarmDescription = function (s) {
                    if (!Object.isNullOrUndefined(s)) {
                        if (s.Description && s.Description.length > 200)
                            return s.Description.substr(0, 200) + '...';
                        else if (s.Description)
                            return s.Description;
                        else
                            return '';
                    }
                    else
                        return '';
                };
                FarmAccountViewModel.prototype.persistCurrentFarm = function () {
                    if (this.currentFarm) {
                        this.currentFarm.Description = $('#farms-richtext-editor').summernote('code');
                        this.persistFarm(this.currentFarm);
                    }
                };
                FarmAccountViewModel.prototype.persistFarm = function (farm) {
                    var _this = this;
                    if (this.isPersistingFarm)
                        return;
                    this.isPersistingFarm = true;
                    this.accountFarm.persistFarmAccount(farm)
                        .then(function (oprc) {
                        delete farm.$nascent;
                        _this.notifyFarm.success('Your farm account information was saved successfully', 'Alert');
                        _this.isPersistingFarm = false;
                    }, function (e) {
                        _this.notifyFarm.error('Something went wrong while saving your farm account information...', 'Oops!');
                        _this.isPersistingFarm = false;
                    });
                };
                FarmAccountViewModel.prototype.refreshFarms = function () {
                    var _this = this;
                    this.accountFarm.getFarmAccounts().then(function (oprc) {
                        _this.farmList = oprc.Result || [];
                    });
                };
                FarmAccountViewModel.$inject = ['#gaia.accountsService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
                return FarmAccountViewModel;
            }());
            Dashboard.FarmAccountViewModel = FarmAccountViewModel;
            var AccountTabsViewModel = (function () {
                function AccountTabsViewModel(counter) {
                    this.counter = counter;
                }
                AccountTabsViewModel.$inject = ['#gaia.dashboard.localServices.AccountCounter'];
                return AccountTabsViewModel;
            }());
            Dashboard.AccountTabsViewModel = AccountTabsViewModel;
            ///local services
            var AccountCounter = (function () {
                function AccountCounter() {
                    this.farmVm = null;
                    this.serviceVm = null;
                    this.businessVm = null;
                }
                AccountCounter.$inject = [];
                return AccountCounter;
            }());
            Dashboard.AccountCounter = AccountCounter;
        })(Dashboard = ViewModels.Dashboard || (ViewModels.Dashboard = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
