
module Gaia.ViewModels.Dashboard {


    export class DashboardViewModel {


        ///Profile
        isEditingBioData: boolean = false;
        isEditingContactData: boolean = false;

        user: Axis.Pollux.Domain.User = null;
        biodata: Axis.Pollux.Domain.BioData = null;
        contact: Axis.Pollux.Domain.ContactData = null;
        profileImage: Axis.Luna.Domain.BinaryData = null;


        ///Biodata stuff
        nameDisplay(): string {
            if (this.biodata) {
                var names = [];
                names.push(this.biodata.LastName);
                if (this.biodata.MiddleName) names.push(this.biodata.MiddleName);
                names.push(this.biodata.FirstName);

                return names.join(' ');
            }
            else return '-N/A-';
        }
        profileImageUrl(): string {
            if (this.profileImage && this.profileImage.IsDataEmbeded) return this.profileImage.EmbededDataUrl();
            else if (this.profileImage) this.profileImage.Data;
            else return '';
        }
        dobDisplay(): string {
            if (this.biodata && this.biodata.Dob) {
                return this.biodata.Dob.toMoment().format('YYYY-MM-DD');
            }
            else return '-N/A-';
        }
        genderDisplay(): string {
            if (this.biodata && this.biodata.Gender) {
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

        set dobBinding(value: Date) {
            if (this.biodata) {
                this.biodata.Dob = new Axis.Apollo.Domain.JsonDateTime().fromMoment(moment.utc(value));
            }
        }
        get dobBinding(): Date {
            if (this.biodata && this.biodata.Dob) return this.biodata.Dob.toMoment().toDate();
            else return null;
        }



        persistBioData(): angular.IPromise<any> {
            return null;
        }
        /// end-biodata-stuff

        persistContactData(): angular.IPromise<any> {
            return null;
        }
        /// end-Profile


        static $inject = ['#gaia.profileService', '#gaia.utils.domModel'];
        constructor(private profileService: Gaia.Services.ProfileService, private domModel: Gaia.Utils.Services.DomModelService) {

            profileService.getBioData().then(oprc => this.biodata = oprc.Result || new Axis.Pollux.Domain.BioData());
            profileService.getContactData().then(oprc => this.contact = oprc.Result.firstOrDefault() || new Axis.Pollux.Domain.ContactData());
            profileService.getUserData().then(oprc => {
                return this.profileImage = oprc.Result
                    .filter(_ud => _ud.Name == 'ProfileImage')
                    .map(_ud => JSON.parse(_ud.Data) as Axis.Luna.Domain.BinaryData)
                    .firstOrDefault();
            });
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