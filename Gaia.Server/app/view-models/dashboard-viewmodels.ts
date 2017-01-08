
module Gaia.ViewModels.Dashboard {


    export class DashboardViewModel {
        accountCategory: string = null;
        description: string = null;
        hasBusinesses: boolean = false;

        canUpgradeAccount: boolean = false;
        hasUpgradeMessage: boolean = false;
        upgradeMessageDescription: string = null;
        hasUpgradeError: boolean = false;

        get upgradeMessageClass(): any {
            return {
                'growl-error': this.hasUpgradeError,
                'growl-success': !this.hasUpgradeError
            }
        }

        get upgradeMessageTitle(): string {
            if (this.hasUpgradeMessage) {
                return this.hasUpgradeError ? 'Error!' : 'Success!';
            }
            else return '';
        }

        get accountClass(): any {
            return {
                'callout-warning': this.accountCategory.startsWith('Service'),
                'callout-success': this.accountCategory.startsWith('Farmer'),
                'callout-default': this.accountCategory.startsWith('Customer')
            };
        }

        upgradeToMerchant() {
            var userId = this.domModel.simpleModel.UserId;

            this.accessProfile.applyAccessProfile(userId, 'system.[Service-Provider Profile]')
                .then(opr => {
                    this.hasUpgradeError = false;
                    this.hasUpgradeMessage = true;
                    this.upgradeMessageDescription = 'Your account was upgraded successfully';

                    window.location.reload();
                }, error => {
                    this.hasUpgradeError = true;
                    this.hasUpgradeMessage = true;
                    this.upgradeMessageDescription = 'An error occured while upgrading your account';
                });
        }


        static $inject = ['#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.accessProfileService'];
        constructor(private domModel: Gaia.Utils.Services.DomModelService, private notifyFarm: Gaia.Utils.Services.NotifyService,
            private accessProfile: Gaia.Services.AccessProfileService) {

            var accessprofiles = (this.domModel.simpleModel.AccessProfiles as string).split(',');
            if (accessprofiles.contains('system.[Farmer Profile]')) {
                this.accountCategory = "Farmer Account";

                this.description = "In addition to enlisting services to be sold in the market place, you may now also enlist farm-products as well.";
            }

            else if (accessprofiles.contains('system.[Service-Provider Profile]')) {
                this.accountCategory = "Service-Provider Account";

                this.description = "Enlist services that your potential customers can descover while searching, and pay for.";
            }

            else if (accessprofiles.contains('system.[Default-User Profile]')) {
                this.accountCategory = "Customer Account";
                this.canUpgradeAccount = true;

                this.description = "Search the market place for all sorts of Goods and services to purchase.";
            }
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
            else return '/content/images/default-image-200.png';
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
                return ns.trim().length > 0 ? ns : '--';
            }
            else return '--';
        }
        dobDisplay(): string {
            if (this.biodata && this.biodata.Dob) {
                return this.biodata.Dob.toMoment().format('Do MMM, YYYY');
            }
            else return '--';
        }
        genderDisplay(): string {
            if (this.biodata && this.biodata.Gender != null && this.biodata.Gender != undefined) {
                return Axis.Pollux.Domain.Gender[this.biodata.Gender];
            }
            else return '--';
        }
        nationalityDisplay(): string {
            if (this.biodata && this.biodata.Nationality) {
                return this.biodata.Nationality
            }
            else return '--';
        }
        stateOfOriginDisplay(): string {
            if (this.biodata && this.biodata.StateOfOrigin) {
                return this.biodata.StateOfOrigin
            }
            else return '--';
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
            else return '--';
        }
        alternatePhoneDisplay(): string {
            if (this.contact && this.contact.AlternatePhone) return this.contact.AlternatePhone;
            else return '--';
        }

        emailDisplay(): string {
            if (this.contact && this.contact.Email) return this.contact.Email;
            else return '--'
        }
        alternateEmailDisplay(): string {
            if (this.contact && this.contact.AlternateEmail) return this.contact.AlternateEmail;
            else return '--'
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

    export class UserAccountViewModel {

        isSelectingAccountType: boolean = true;
        isModifyingFarms: boolean = false;

        isConsumerAccount(): boolean {
            var accountProfiles: string = this.domModel.simpleModel.AccessProfiles;
            return accountProfiles.contains(Utils.ConsumerAccountProfile);
        }
        activateConsumerAccount(activate: boolean) {
            if (!this.isConsumerAccount() && activate) this.applyAccountProfile(Utils.ConsumerAccountProfile);
            else if (this.isConsumerAccount() && !activate) this.revokeAccountProfile(Utils.ConsumerAccountProfile);
        }

        isServiceProviderAccount(): boolean {
            var accountProfiles: string = this.domModel.simpleModel.AccessProfiles;
            return accountProfiles.contains(Utils.ServiceProvierAccountProfile);
        }
        activateServiceProviderAccount(activate: boolean) {
            if (!this.isServiceProviderAccount() && activate) this.applyAccountProfile(Utils.ServiceProvierAccountProfile);
            else if (this.isServiceProviderAccount() && !activate) this.revokeAccountProfile(Utils.ServiceProvierAccountProfile);
        }

        isFarmerAccount(): boolean {
            var accountProfiles: string = this.domModel.simpleModel.AccessProfiles;
            return accountProfiles.contains(Utils.FarmerAccountProfile);
        }
        activateFarmerAccount(activate: boolean) {
            if (!this.isFarmerAccount() && activate) this.applyAccountProfile(Utils.FarmerAccountProfile);
            else if (this.isFarmerAccount() && !activate) this.revokeAccountProfile(Utils.FarmerAccountProfile);
        }

        private applyAccountProfile(profile: string) {
            var userId = this.domModel.simpleModel.UserId;

            this.accessProfile.applyAccessProfile(userId, profile)
                .then(opr => {
                    this.notify.success('Your account was upgraded successfully');

                    window.location.reload();
                }, error => {
                    this.notify.error('An error occured while upgrading your account');
                });
        }
        private revokeAccountProfile(profile: string) {
            var userId = this.domModel.simpleModel.UserId;

            this.accessProfile.revokeAccessProfile(userId, profile)
                .then(opr => {
                    this.notify.success('Your account was modified successfully');

                    window.location.reload();
                }, error => {
                    this.notify.error('An error occured while modifying your account');
                });
        }


        static $inject = ['#gaia.utils.domModel', '#gaia.accessProfileService', '#gaia.utils.notify'];
        constructor(private domModel: Gaia.Utils.Services.DomModelService, private accessProfile: Gaia.Services.AccessProfileService,
            private notify: Gaia.Utils.Services.NotifyService) {
            
        }
    }

    //Obsolete
    export class BusinessAccountViewModel {

        user: Axis.Pollux.Domain.User = null;
        
        businessList: Axis.Pollux.Domain.CorporateData[] = [];
        isListingBusinesses: boolean = true;
        isEditingBusiness: boolean = false;
        isPersistingBusiness: boolean = false;
        isDetailingBusiness: boolean = false;
        hasBusinessPersistenceError: boolean = false;
        currentBusinessData: Axis.Pollux.Domain.CorporateData = null;

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
                    //this.currentBusinessData = null;
                    this.businessList = oprc.Result || [];
                    if (this.businessList.length > 0) {
                        this.scope.$parent['vm'].hasBusinesses = true;
                    }
                    else {
                        this.scope.$parent['vm'].hasBusinesses = false;
                    }
                }, e => {
                    this.notifyService.error('Something went wrong while retrieving your business data...', 'Oops!');
                });
        }

        displayDate(date: Axis.Apollo.Domain.JsonDateTime): string {
            if (date) return date.toMoment().format('Do MMM, YYYY');
            else return '';
        }


        static $inject = ['#gaia.profileService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter', '$scope'];
        constructor(private profileService: Gaia.Services.ProfileService, private domModel: Gaia.Utils.Services.DomModelService,
            private notifyService: Gaia.Utils.Services.NotifyService, counter: AccountCounter, private scope: ng.IScope) {

            counter.businessVm = this;
            this.refreshBusinesss();
            this.user = new Axis.Pollux.Domain.User({
                UserId: domModel.simpleModel.UserId,
                EntityId: domModel.simpleModel.UserId,
                Stataus: 1
            });
        }
    }


    export class FarmAccountViewModel {

        user: Axis.Pollux.Domain.User = null;

        farmList: Gaia.Domain.Farm[] = [];
        currentFarm: Gaia.Domain.Farm = null;

        farmCategories: string[] = [];

        isListingFarms: boolean = true;
        isEditingFarm: boolean = false;
        isPersistingFarm: boolean = false;
        isDetailingFarm: boolean = false;
        hasFarmPersistenceError: boolean = false;

        hasFarmerAccessProfile: boolean = false;

        get selectedFarmCategory(): string {
            if (this.currentFarm && !Object.isNullOrUndefined(this.currentFarm.FarmType)) return Gaia.Domain.FarmType[this.currentFarm.FarmType] as string;
            else return 'Not Selected';
        }

        clearUI() {
            this.isListingFarms = this.isEditingFarm = this.isPersistingFarm = this.hasFarmPersistenceError = false;
        }

        backToListingFarms() {
            if (this.currentFarm['$nascent']) {
                this.farmList.remove(this.currentFarm);
                this.currentFarm = null;
            }

            this.clearUI();
            this.isListingFarms = true;
        }

        farmCategory(farm: Gaia.Domain.Farm): string {
            if (!Object.isNullOrUndefined(farm) && !Object.isNullOrUndefined(farm.FarmType)) return Gaia.Domain.FarmType[farm.FarmType];
            else return '';
        }
        selectCategory(type: string) {
            if (this.currentFarm) {
                this.currentFarm.FarmType = Gaia.Domain.FarmType[type];
            }
        }

        addFarm(): Gaia.Domain.Farm {
            var newobj = new Gaia.Domain.Farm({ OwnerId: this.user.EntityId });
            (newobj as any).$nascent = true;
            this.farmList = [newobj].concat(this.farmList);
            return newobj;
        }
        addAndEditFarm() {
            this.editFarm(this.addFarm());
        }
        editFarm(s: Gaia.Domain.Farm) {
            if (s) {
                this.currentFarm = s;
                this.clearUI();
                this.isEditingFarm = true;

                ($('#farms-richtext-editor') as any).summernote('code', this.currentFarm.Description || '');
            }
        }

        showFarmDetails(s: Gaia.Domain.Farm) {
            if (!Object.isNullOrUndefined(s)) {
                this.currentFarm = s;
                this.clearUI();
                this.isDetailingFarm = true;
            }
        }
        getFarmDescription(s: Gaia.Domain.Farm): string {
            if (!Object.isNullOrUndefined(s)) {
                if (s.Description && s.Description.length > 200) return s.Description.substr(0, 200) + '...';
                else if (s.Description) return s.Description;
                else return '';
            }
            else return '';
        }

        persistCurrentFarm() {
            if (this.currentFarm) {
                this.currentFarm.Description = ($('#farms-richtext-editor') as any).summernote('code');
                this.persistFarm(this.currentFarm);
            }
        }
        persistFarm(farm: Gaia.Domain.Farm) {
            if (this.isPersistingFarm) return;

            this.isPersistingFarm = true;
            this.accountFarm.persistFarm(farm)
                .then(oprc => {
                    delete (farm as any).$nascent;
                    this.notifyFarm.success('Your farm account information was saved successfully', 'Alert');
                    this.isPersistingFarm = false;
                }, e => {
                    this.notifyFarm.error('Something went wrong while saving your farm account information...', 'Oops!');
                    this.isPersistingFarm = false;
                });
        }
        refreshFarms() {
            this.accountFarm.getFarmAccounts().then(oprc => {
                this.farmList = oprc.Result || [];
            });
        }


        static $inject = ['#gaia.accountsService', '#gaia.utils.domModel', '#gaia.utils.notify', '#gaia.dashboard.localServices.AccountCounter'];
        constructor(private accountFarm: Gaia.Services.UserAccountService, private domModel: Gaia.Utils.Services.DomModelService,
            private notifyFarm: Gaia.Utils.Services.NotifyService, counter: AccountCounter) {

            var accessprofiles = (this.domModel.simpleModel.AccessProfiles as string).split(',');
            if (accessprofiles.contains('system.[Farmer Profile]')) {

                this.hasFarmerAccessProfile = true;

                counter.farmVm = this;

                this.refreshFarms();

                this.user = new Axis.Pollux.Domain.User({
                    UserId: domModel.simpleModel.UserId,
                    EntityId: domModel.simpleModel.UserId,
                    Stataus: 1
                });

                this.farmCategories = Object
                    .keys(Gaia.Domain.FarmType)
                    .map(k => Gaia.Domain.FarmType[k] as string)
                    .filter(v => typeof v === "string");
            }
        }
    }


    export class AccountTabsViewModel {

        get hasBusinesses(): boolean {
            return this.counter.businessVm.businessList.length > 0;
        }

        static $inject = ['#gaia.dashboard.localServices.AccountCounter']
        constructor(public counter: AccountCounter) {
        }
    }


    ///local services
    export class AccountCounter {

        farmVm: FarmAccountViewModel = null;
        businessVm: BusinessAccountViewModel = null;

        static $inject = [];
        constructor() {
        }
    }

}