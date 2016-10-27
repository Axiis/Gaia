
module Gaia.ViewModels.Dashboard {


    export class DashboardViewModel {

        constructor() {
        }
    }


    export class ProfileViewModel {

        user: Axis.Pollux.Domain.User = null;

        ///<<Profile>
        isEditingBioData: boolean = false;
        isEditingContactData: boolean = false;
        isProfileImageChanged: boolean = false;
        isPersistingProfileImage: boolean = false;
        isRemovingProfileImage: boolean = false;

        hasBiodataPersistenceError: boolean = false;
        hasContactdataPersistenceError: boolean = false;
        hasProfileImagePersistenceError: boolean = false;

        biodata: Axis.Pollux.Domain.BioData = null;
        contact: Axis.Pollux.Domain.ContactData = null;

        ///<Profile Image Stuff>
        private _originalImage: Axis.Luna.Domain.BinaryData = null;
        private _profileImage: Axis.Luna.Domain.BinaryData = null;
        get profileImage(): Axis.Luna.Domain.BinaryData {
            return this._profileImage;
        }
        set profileImage(value: Axis.Luna.Domain.BinaryData) {
            this._profileImage = value;
            this.isProfileImageChanged = true;
        }

        profileImageUrl(): string {
            if (this.profileImage && this.profileImage.IsDataEmbeded) return this.profileImage.EmbededDataUrl();
            else if (this.profileImage) this.profileImage.Data;
            else return '/content/images/default-image-200.jpg';
        }

        removeProfileImage() {
            if (this.isProfileImageChanged) {
                this.profileImage = this._originalImage;
                this.isProfileImageChanged = false;
            }
            else {
                if (this.isRemovingProfileImage) return;

                this.isRemovingProfileImage = true;
                this.profileService.removeData(['ProfileImage'])
                    .then(oprc => {
                        this.profileImage = this._originalImage = null;
                        this.isRemovingProfileImage = false;
                        this.isProfileImageChanged = false;
                    }, e => {
                        this.isRemovingProfileImage = false;
                        this.hasProfileImagePersistenceError = true;
                        this.notifyService.error('Something went wrong while removing your profile image...', 'Oops!');
                    });
            }
        }
        persistProfileImage() {
            if (this.isPersistingProfileImage) return;

            this.isPersistingProfileImage = true;
            this.profileService.removeData(['ProfileImage'])
                .then(oprc => this.profileService.addData([new Axis.Pollux.Domain.UserData({
                    Data: JSON.stringify(this.profileImage),
                    Name: 'ProfileImage',
                    OwnerId: this.user.UserId
                })]).then(oprcx => {
                    this.isPersistingProfileImage = false;
                    this._originalImage = this.profileImage;
                    this.isProfileImageChanged = false;
                }), e => {
                    this.isPersistingProfileImage = false;
                    this.hasProfileImagePersistenceError = true;
                    this.notifyService.error('Something went wrong while saving your profile image...', 'Oops!');
                });
        }
        refreshProfileImage() {
            this.profileService.getUserData().then(oprc => {
                this._originalImage = this.profileImage = oprc.Result
                    .filter(_ud => _ud.Name == 'ProfileImage')
                    .map(_ud => new Axis.Luna.Domain.BinaryData(JSON.parse(_ud.Data)))
                    .firstOrDefault();
                this.isProfileImageChanged = false;
            });
        }

        ///</profile image stuff>


        ///<Biodata stuff>
        isPersistingBiodata: boolean = false;

        nameDisplay(): string {
            if (this.biodata) {
                var names = [];
                names.push(this.biodata.LastName);
                if (this.biodata.MiddleName) names.push(this.biodata.MiddleName);
                names.push(this.biodata.FirstName);

                var ns = names.join(' ');
                return ns.trim().length > 0 ? ns : '-N/A-';
            }
            else return '-N/A-';
        }
        dobDisplay(): string {
            if (this.biodata && this.biodata.Dob) {
                return this.biodata.Dob.toMoment().format('Do MMM, YYYY');
            }
            else return '-N/A-';
        }
        genderDisplay(): string {
            if (this.biodata && this.biodata.Gender != null && this.biodata.Gender != undefined) {
                return Axis.Pollux.Domain.Gender[this.biodata.Gender];
            }
            else return '-N/A-';
        }
        nationalityDisplay(): string {
            if (this.biodata && this.biodata.Nationality) {
                return this.biodata.Nationality
            }
            else return '-N/A-';
        }
        stateOfOriginDisplay(): string {
            if (this.biodata && this.biodata.StateOfOrigin) {
                return this.biodata.StateOfOrigin
            }
            else return '-N/A-';
        }

        isFirstNameSet(): boolean {
            if (this.biodata && this.biodata.FirstName) return true;
            else return false;
        }
        isLastNameSet(): boolean {
            if (this.biodata && this.biodata.LastName) return true;
            else return false;
        }

        private _dobField: Date;
        set dobBinding(value: Date) {
            if (this.biodata) {
                this.biodata.Dob = new Axis.Apollo.Domain.JsonDateTime().fromMoment(moment.utc(value));
                this._dobField = value;
            }
        }
        get dobBinding(): Date {
            return this._dobField;
        }

        persistBiodata() {
            if (this.isPersistingBiodata) return;

            this.isPersistingBiodata = true;
            this.profileService.modifyBioData(this.biodata)
                .then(oprc => {
                    this.isEditingBioData = false;
                    this.hasBiodataPersistenceError = false;
                    this.isPersistingBiodata = false;
                }, e => {
                    this.hasBiodataPersistenceError = true;
                    this.isPersistingBiodata = false;
                    this.notifyService.error('Something went wrong while saving your Bio data...', 'Oops!');
                });
        }
        refreshBiodata() {
            this.profileService.getBioData().then(oprc => {
                this.biodata = oprc.Result || new Axis.Pollux.Domain.BioData();
                this._dobField = this.biodata.Dob ? this.biodata.Dob.toMoment().toDate() : null;
            });
        }
        /// <Biodata-stuff>


        ///<contact stuff>
        isPersistingContactdata: boolean = false;

        phoneDisplay(): string {
            if (this.contact && this.contact.Phone) return this.contact.Phone;
            else return '-N/A-';
        }
        alternatePhoneDisplay(): string {
            if (this.contact && this.contact.AlternatePhone) return this.contact.AlternatePhone;
            else return '-N/A-';
        }

        emailDisplay(): string {
            if (this.contact && this.contact.Email) return this.contact.Email;
            else return '-N/A-'
        }
        alternateEmailDisplay(): string {
            if (this.contact && this.contact.AlternateEmail) return this.contact.AlternateEmail;
            else return '-N/A-'
        }

        persistContactData() {
            if (this.isPersistingContactdata) return;

            this.isPersistingContactdata = true;
            this.profileService.persistContactData(this.contact)
                .then(oprc => {
                    this.isEditingContactData = false;
                    this.hasContactdataPersistenceError = false;
                    this.isPersistingContactdata = false;
                }, e => {
                    this.hasContactdataPersistenceError = true;
                    this.isPersistingContactdata = false;
                    this.notifyService.error('Something went wrong while saving your Contact data...', 'Oops!');
                });
        }
        refreshContactData() {
            this.profileService.getContactData().then(oprc => {
                this.contact = oprc.Result.firstOrDefault() || new Axis.Pollux.Domain.ContactData({ Email: this.user.UserId });
            });
        }
        /// </contact-stuff>

        ///</Profile>

        static $inject = ['#gaia.profileService', '#gaia.utils.domModel', '#gaia.utils.notify'];
        constructor(private profileService: Gaia.Services.ProfileService, private domModel: Gaia.Utils.Services.DomModelService,
            private notifyService: Gaia.Utils.Services.NotifyService) {

            this.refreshBiodata();
            this.refreshContactData();
            this.refreshProfileImage();
            this.user = new Axis.Pollux.Domain.User({
                UserId: domModel.simpleModel.UserId,
                EntityId: domModel.simpleModel.UserId,
                Stataus: 1
            });
        }
    }


    export class BusinessAccountViewModel {

        user: Axis.Pollux.Domain.User = null;
        
        businessList: Axis.Pollux.Domain.CorporateData[] = [];
        currentBusinessData: Axis.Pollux.Domain.CorporateData = null;
        isListingBusinesses: boolean = true;
        isEditingBusiness: boolean = false;
        isPersistingBusiness: boolean = false;
        isDetailingBusiness: boolean = false;
        hasBusinessPersistenceError: boolean = false;

        private _incorporationDate: Date;
        set businessIncorporationDateBinding(value: Date) {
            if (this.currentBusinessData) {
                this.currentBusinessData.IncorporationDate = new Axis.Apollo.Domain.JsonDateTime().fromMoment(moment.utc(value));
                this._incorporationDate = value;
            }
        }
        get businessIncorporationDateBinding(): Date {
            return this._incorporationDate;
        }

        isDraft(business: Axis.Pollux.Domain.CorporateData): boolean {
            if (business) return business.Status == Gaia.Utils.BusinessStatus_Draft;
            else return false;
        }
        isRejected(business: Axis.Pollux.Domain.CorporateData): boolean {
            if (business) return business.Status == Gaia.Utils.BusinessStatus_Rejected;
            else return false;
        }
        isVerified(business: Axis.Pollux.Domain.CorporateData): boolean {
            if (business) return business.Status == Gaia.Utils.BusinessStatus_Verified;
            else return false;
        }
        isVerifying(business: Axis.Pollux.Domain.CorporateData): boolean {
            if (business) return business.Status == Gaia.Utils.BusinessStatus_Verifying;
            else return false;
        }

        isBusinessNameSet(): boolean {
            if (this.currentBusinessData && this.currentBusinessData.CorporateName) {
                return this.currentBusinessData.CorporateName.length > 0;
            }
            else return false;
        }
        isBusinessIdSet(): boolean {
            if (this.currentBusinessData && this.currentBusinessData.CorporateId) {
                return this.currentBusinessData.CorporateId.length > 0;
            }
            else return false;
        }
        isBusinessIncorporationDateSet(): boolean {
            if (this.currentBusinessData && this.currentBusinessData.IncorporationDate) return true;
            else return false;
        }

        backToListingBusinesses() {
            if (this.currentBusinessData['$nascent']) {
                this.businessList.remove(this.currentBusinessData);
                this.currentBusinessData = null;
            }

            this.clearBusinessView();
            this.isListingBusinesses = true;
        }

        private clearBusinessView() {
            this.isListingBusinesses = false;
            this.isEditingBusiness = false;
            this.isDetailingBusiness = false;
        }

        getBusinessDescription(b: Axis.Pollux.Domain.CorporateData): string {
            if (b) {
                if (b.Description && b.Description.length > 200) return b.Description.substr(0, 200) + '...';
                else if (b.Description) return b.Description;
                else return '';
            }
            else return '';
        }

        showBusinessDetails(b: Axis.Pollux.Domain.CorporateData) {
            if (b) {
                this.currentBusinessData = b;
                this.clearBusinessView();
                this.isDetailingBusiness = true;
            }
        }
        addBusiness(): Axis.Pollux.Domain.CorporateData {
            var newobj = new Axis.Pollux.Domain.CorporateData({ OwnerId: this.user.EntityId });
            (newobj as any).$nascent = true;
            this.businessList = [newobj].concat(this.businessList);
            return newobj;
        }
        addAndEditBusiness() {
            this.editBusiness(this.addBusiness());
        }
        editBusiness(b: Axis.Pollux.Domain.CorporateData) {
            if (b) {
                this.currentBusinessData = b;
                this.clearBusinessView();
                this.isEditingBusiness = true;

                ($('#richtext-editor') as any).summernote('code', this.currentBusinessData.Description || '');
            }
        }
        removeBusiness(b: Axis.Pollux.Domain.CorporateData) {
            if (b && (b as any).$nascent) {
                this.businessList.remove(b);
            }
            else if (b && b.Status == Gaia.Utils.BusinessStatus_Draft) {
                this.profileService.removeCorporateData([b.EntityId])
                    .then(oprc => {
                        this.businessList.remove(b);
                        this.notifyService.success('Business data removed successfully', 'Alert');
                    }, e => {
                        this.notifyService.error('Something went wrong while removing your business data...', 'Oops!');
                    });
            }
        }
        persistCurrentBusinessData() {
            if (this.currentBusinessData) {
                this.currentBusinessData.Description = ($('#richtext-editor') as any).summernote('code');
                this.persistBusiness(this.currentBusinessData);
            }
        }
        persistBusiness(b: Axis.Pollux.Domain.CorporateData) {
            if (b && b.Status == Gaia.Utils.BusinessStatus_Draft) {
                if (!this.isPersistingBusiness) {
                    this.isPersistingBusiness = true;
                    this.profileService.persistCorporateData(b)
                        .then(oprc => {
                            delete (b as any).$nascent;
                            this.notifyService.success('Business data was saved successfully', 'Alert');
                            this.isPersistingBusiness = false;
                        }, e => {
                            this.notifyService.error('Something went wrong while saving your business data...', 'Oops!');
                            this.isPersistingBusiness = false;
                        });
                }
            }
        }
        refreshBusinesss() {
            this.profileService.getCorporateData()
                .then(oprc => {
                    this.currentBusinessData = null;
                    this.businessList = oprc.Result || [];
                }, e => {
                    this.notifyService.error('Something went wrong while retrieving your business data...', 'Oops!');
                });
        }

        displayDate(date: Axis.Apollo.Domain.JsonDateTime): string {
            if (date) return date.toMoment().format('Do MMM, YYYY');
            else return '';
        }


        static $inject = ['#gaia.profileService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
        constructor(private profileService: Gaia.Services.ProfileService, private domModel: Gaia.Utils.Services.DomModelService,
            private notifyService: Gaia.Utils.Services.NotifyService, counter: AccountCounter) {

            counter.businessVm = this;
            this.refreshBusinesss();
            this.user = new Axis.Pollux.Domain.User({
                UserId: domModel.simpleModel.UserId,
                EntityId: domModel.simpleModel.UserId,
                Stataus: 1
            });
        }
    }


    export class ServiceAccountViewModel {

        user: Axis.Pollux.Domain.User = null;

        serviceList: Gaia.Domain.ServiceAccount[] = [];
        currentService: Gaia.Domain.ServiceAccount = null;

        serviceCategories: string[] = [];

        isListingServices: boolean = true;
        isEditingService: boolean = false;
        isPersistingService: boolean = false;
        isDetailingService: boolean = false;
        hasServicePersistenceError: boolean = false;

        get selectedServiceCategory(): string {
            if (this.currentService && !Object.isNullOrUndefined(this.currentService.ServiceType)) return Gaia.Domain.ServiceType[this.currentService.ServiceType] as string;
            else return 'Not Selected';
        }

        clearUI() {
            this.isListingServices = this.isEditingService = this.isPersistingService = this.hasServicePersistenceError = false;
        }

        backToListingServices() {
            if (this.currentService['$nascent']) {
                this.serviceList.remove(this.currentService);
                this.currentService = null;
            }

            this.clearUI();
            this.isListingServices = true;
        }

        serviceCategory(service: Gaia.Domain.ServiceAccount): string {
            if (service && service.ServiceType) return Gaia.Domain.ServiceType[service.ServiceType];
            else return '';
        }
        selectCategory(type: string) {
            if (this.currentService) {
                this.currentService.ServiceType = Gaia.Domain.ServiceType[type];
            }
        }

        addService(): Gaia.Domain.ServiceAccount {
            var newobj = new Gaia.Domain.ServiceAccount({ OwnerId: this.user.EntityId });
            (newobj as any).$nascent = true;
            this.serviceList = [newobj].concat(this.serviceList);
            return newobj;
        }
        addAndEditService() {
            this.editService(this.addService());
        }
        editService(s: Gaia.Domain.ServiceAccount) {
            if (s) {
                this.currentService = s;
                this.clearUI();
                this.isEditingService = true;

                ($('#services-richtext-editor') as any).summernote('code', this.currentService.Description || '');
            }
        }

        showServiceDetail(s: Gaia.Domain.ServiceAccount) {
            if (!Object.isNullOrUndefined(s)) {
                this.currentService = s;
                this.clearUI();
                this.isDetailingService = true;
            }
        }
        getServiceDescription(s: Gaia.Domain.ServiceAccount): string {
            if (!Object.isNullOrUndefined(s)) {
                if (s.Description && s.Description.length > 200) return s.Description.substr(0, 200) + '...';
                else if (s.Description) return s.Description;
                else return '';
            }
            else return '';
        }

        persistCurrentService() {
            if (this.currentService) {
                this.currentService.Description = ($('#services-richtext-editor') as any).summernote('code');
                this.persistService(this.currentService);
            }
        }
        persistService(service: Gaia.Domain.ServiceAccount) {
            if (this.isPersistingService) return;

            this.isPersistingService = true;
            this.accountService.persistServiceAccount(service)
                .then(oprc => {
                    delete (service as any).$nascent;
                    this.notifyService.success('Your service account information was saved successfully', 'Alert');
                    this.isPersistingService = false;
                }, e => {
                    this.notifyService.error('Something went wrong while saving your service account information...', 'Oops!');
                    this.isPersistingService = false;
                });
        }
        refreshServices() {
            this.accountService.getServiceAccounts().then(oprc => {
                this.serviceList = oprc.Result || [];
            });
        }


        static $inject = ['#gaia.accountsService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
        constructor(private accountService: Gaia.Services.UserAccountService, private domModel: Gaia.Utils.Services.DomModelService,
            private notifyService: Gaia.Utils.Services.NotifyService, counter: AccountCounter) {

            counter.serviceVm = this;

            this.refreshServices();
            this.user = new Axis.Pollux.Domain.User({
                UserId: domModel.simpleModel.UserId,
                EntityId: domModel.simpleModel.UserId,
                Stataus: 1
            });

            this.serviceCategories = Object
                .keys(Gaia.Domain.ServiceType)
                .map(k => Gaia.Domain.ServiceType[k] as string)
                .filter(v => typeof v === "string");
        }
    }


    export class FarmAccountViewModel {

        user: Axis.Pollux.Domain.User = null;

        farmList: Gaia.Domain.FarmAccount[] = [];
        currentService: Gaia.Domain.FarmAccount = null;

        isListingFarms: boolean = false;
        isEditingFarm: boolean = false;
        isPersistingFarm: boolean = false;
        hasFarmPersistenceError: boolean = false;


        persistFarm(farm: Gaia.Domain.FarmAccount) {
            if (this.isPersistingFarm) return;

            this.isPersistingFarm = true;
            this.accountService.persistFarmAccount(farm)
                .then(oprc => {
                    this.isEditingFarm = false;
                    this.hasFarmPersistenceError = false;
                    this.isPersistingFarm = false;
                }, e => {
                    this.isPersistingFarm = false;
                    this.notifyService.error('Something went wrong while saving your Service Account...', 'Oops!');
                });
        }
        refreshServices() {
            this.accountService.getFarmAccounts().then(oprc => {
                this.farmList = oprc.Result || [];
            });
        }


        static $inject = ['#gaia.accountsService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
        constructor(private accountService: Gaia.Services.UserAccountService, private domModel: Gaia.Utils.Services.DomModelService,
            private notifyService: Gaia.Utils.Services.NotifyService, counter: AccountCounter) {

            counter.farmVm = this;

            this.refreshServices();
            this.user = new Axis.Pollux.Domain.User({
                UserId: domModel.simpleModel.UserId,
                EntityId: domModel.simpleModel.UserId,
                Stataus: 1
            });
        }
    }


    export class AccountTabsViewModel {

        static $inject = ['#gaia.dashboard.localServices.AccountCounter']
        constructor(public counter: AccountCounter) {
        }
    }


    ///local services
    export class AccountCounter {

        farmVm: FarmAccountViewModel = null;
        serviceVm: ServiceAccountViewModel = null;
        businessVm: BusinessAccountViewModel = null;

        static $inject = [];
        constructor() {
        }
    }

}