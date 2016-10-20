
module Gaia.ViewModels.Dashboard {


    export class DashboardViewModel {


        ///Profile
        isEditingBioData: boolean = false;
        isEditingContactData: boolean = false;
        isProfileImageChanged: boolean = false;
        isPersistingProfileImage: boolean = false;
        isRemovingProfileImage: boolean = false;

        hasBiodataPersistenceError: boolean = false;
        hasContactdataPersistenceError: boolean = false;
        hasProfileImagePersistenceError: boolean = false;

        user: Axis.Pollux.Domain.User = null;
        biodata: Axis.Pollux.Domain.BioData = null;
        contact: Axis.Pollux.Domain.ContactData = null;

        ///Profile Image Stuff
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
                    });
            }
        }
        persistProfileImage() {
            if (this.isPersistingProfileImage) return;

            this.isPersistingProfileImage = true;
            this.profileService.removeData(['ProfileImage'])
                .then(oprc => this.profileService.addData([new Axis.Pollux.Domain.UserData({
                    Data : JSON.stringify(this.profileImage),
                    Name: 'ProfileImage',
                    OwnerId: this.user.UserId
                })]).then(oprcx => {
                    this.isPersistingProfileImage = false;
                    this._originalImage = this.profileImage;
                    this.isProfileImageChanged = false;
                    }), e => {
                    this.isPersistingProfileImage = false;
                    this.hasProfileImagePersistenceError = true;
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

        ///end-profile image stuff


        ///Biodata stuff
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
                return this.biodata.Dob.toMoment().format('YYYY-MM-DD');
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
                });
        }
        refreshBiodata() {
                this.profileService.getBioData().then(oprc => {
                this.biodata = oprc.Result || new Axis.Pollux.Domain.BioData();
                this._dobField = this.biodata.Dob ? this.biodata.Dob.toMoment().toDate() : null;
            });
        }
        /// end-biodata-stuff


        ///contact stuff
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
            this.profileService.modifyContactData(this.contact)
                .then(oprc => {
                    this.isEditingContactData = false;
                    this.hasContactdataPersistenceError = false;
                    this.isPersistingContactdata = false;
                }, e => {
                    this.hasContactdataPersistenceError = true;
                    this.isPersistingContactdata = false;
                });
        }
        refreshContactData() {
            this.profileService.getContactData().then(oprc => {
                this.contact = oprc.Result.firstOrDefault() || new Axis.Pollux.Domain.ContactData({ Email: this.user.UserId });
            });
        }
        /// end-contact-stuff

        /// end-Profile

        ///Accounts

        //<businesses>
        businessList: Axis.Pollux.Domain.CorporateData[] = [];
        isListingBusinesses: boolean = true;
        isEditingBusiness: boolean = false;
        isDetailingBusiness: boolean = false;
        currentBusinessData: Axis.Pollux.Domain.CorporateData = null;

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
        editBusiness(b: Axis.Pollux.Domain.CorporateData) {
            if (b) {
                this.currentBusinessData = b;
                this.clearBusinessView();
                this.isEditingBusiness = true;
            }
        }
        removeBusiness(b: Axis.Pollux.Domain.CorporateData) {
            if (b && b.Status == Gaia.Utils.BusinessStatus_Draft) {
                //this.profileService.r
            }
        }

        persistBusiness(b: Axis.Pollux.Domain.CorporateData) {
        }
        refreshBusinesss() {
        }

        //</businesses>



        static $inject = ['#gaia.profileService', '#gaia.utils.domModel'];
        constructor(private profileService: Gaia.Services.ProfileService, private domModel: Gaia.Utils.Services.DomModelService) {

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


    export class ProfileViewModel {

        constructor() {
        }
    }

}