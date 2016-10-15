
module Gaia.ViewModels.Dashboard {


    export class DashboardViewModel {


        ///Profile
        isEditingBioData: boolean = false;
        isEditingContactData: boolean = false;

        user: Axis.Pollux.Domain.User = null;
        biodata: Axis.Pollux.Domain.BioData = null;
        contact: Axis.Pollux.Domain.ContactData = null;

        names(): string {
            return null;
        }

        profileImageUrl(): string {
            return null;
        }

        dobInfo(): string {
            return null;
        }


        persistBioData(): angular.IPromise<any> {
            return null;
        }
        persistContactData(): angular.IPromise<any> {
            return null;
        }
        /// end-Profile


        static $inject = ['#gaia.profileService', '#gaia.utils.domModel'];
        constructor(private profileService: Gaia.Services.ProfileService, private domModel: Gaia.Utils.Services.DomModelService) {

            profileService.getBioData().success(oprc => this.biodata = oprc.Result);
            profileService.getContactData().success(oprc => this.contact = oprc.Result.firstOrDefault<Domain.ContactData>());
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