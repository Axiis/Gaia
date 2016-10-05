
module Gaia.ViewModels.Dashboard {


    export class DashboardViewModel {

        isEditingBioData: boolean = false;
        isEditingContactData: boolean = false;
        isEditingSecurityData: boolean = false;

        user: Gaia.Domain.User = null;
        biodata: Gaia.Domain.BioData = null;
        contact: Gaia.Domain.ContactData = null;

        names(): string {
            return null;
        }


        persistBioData(): angular.IPromise<any> {
            return null;
        }
        persistContactData(): angular.IPromise<any> {
            return null;
        }


        static $inject = [];
        constructor() {
        }
    }


    export class ProfileViewModel {

        constructor() {
        }
    }

}