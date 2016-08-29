import _gaia from '../root'


export class ProfileService {



    static $inject = ["$http"];
    constructor(private $http: ng.IHttpService) {
    }


    public registerUser(): ng.IHttpPromise<any> {
        return null;
    }
    public registerAdminUser(): ng.IHttpPromise<any> {
        return null;
    }
    public createRegistrationVerification(): ng.IHttpPromise<any> {
        return null;
    }
    public verifyUserRegistration(): ng.IHttpPromise<any> {
        return null;
    }
    public modifyBioData(): ng.IHttpPromise<any> {
        return null;
    }
    public modifyContactData(): ng.IHttpPromise<any> {
        return null;
    }
    public modifyCorporateData(): ng.IHttpPromise<any> {
        return null;
    }
    public addData(): ng.IHttpPromise<any> {
        return null;
    }
    public removeData(): ng.IHttpPromise<any> {
        return null;
    }
    public archiveUser(): ng.IHttpPromise<any> {
        return null;
    }
    public createActivationVerification(): ng.IHttpPromise<any> {
        return null;
    }
    public verifyUserActivation(): ng.IHttpPromise<any> {
        return null;
    }
}
_gaia.service("ProfileService", ProfileService);

