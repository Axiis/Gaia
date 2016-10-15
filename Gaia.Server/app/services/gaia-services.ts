
module Gaia.Services {

    export class ProfileService {


        static $inject = ["#gaia.utils.domainTransport"];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
        }


        public registerUser(targetUser: string, credentials: Array<Axis.Pollux.Domain.Credential>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<void>('/api/profiles', {
                TargetUser: targetUser,
                Credentials: credentials
            }, config).then(oprc => oprc.data);
        }
        public registerAdminUser(targetUser: string, secretCredentials: Array<Axis.Pollux.Domain.Credential>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<void>('/api/admin-profiles', {
                TargetUser: targetUser,
                Credentials: secretCredentials
            }, config).then(oprc => oprc.data);
        }
        public verifyUserRegistration(targetUser: string, verificationToken: string, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<void>('/api/profiles/verification', {
                User: targetUser,
                Value: verificationToken
            }, config).then(oprc => oprc.data);
        }

        public archiveUser(userId: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>>('/api/profiles/archives', {
                User: userId
            }, config).then(oprc => {
                oprc.data.Result = new Axis.Pollux.Domain.User(oprc.data.Result);
                return oprc.data;
            });                
        }

        public createActivationVerification(userId: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>>('/api/profiles/activation', {
                User: userId
            }, config).then(oprc => {
                oprc.data.Result = new Axis.Pollux.Domain.User(oprc.data.Result);
                return oprc.data;
            });
        }
        public verifyUserActivation(userId: string, token: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>>('/api/profiles/activation', {
                User: userId,
                Value: token
            }, config).then(oprc => {
                oprc.data.Result = new Axis.Pollux.Domain.User(oprc.data.Result);
                return oprc.data;
            });
        }

        public getUserData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Array<Axis.Pollux.Domain.UserData>>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Array<Axis.Pollux.Domain.UserData>>>('/api/profiles/data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result.map(_ud => new Axis.Pollux.Domain.UserData(_ud));
                return oprc.data;
            });
        }
        public addData(data: Array<Axis.Pollux.Domain.UserData>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<void>('/api/profiles/data', {
                DataList: data
            }, config).then(oprc => oprc.data);
        }
        public removeData(dataNames: Array<string>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/data/?dataNames=' + dataNames.join(','), null, config)
                .then(oprc => oprc.data);
        }


        public getBioData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.BioData>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.BioData>>('/api/profiles/bio-data', null, config).then(oprc => {
                oprc.data.Result = new Axis.Pollux.Domain.BioData(oprc.data.Result);
                return oprc.data;
            });
        }
        public modifyBioData(biodata: Axis.Pollux.Domain.BioData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<void>('/api/profiles/bio-data', biodata, config).then(oprc => oprc.data);
        }


        public getContactData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Array<Axis.Pollux.Domain.ContactData>>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.ContactData[]>>('/api/profiles/contact-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result.map(_cd => new Axis.Pollux.Domain.ContactData(_cd));
                return oprc.data;
            });
        }
        public modifyContactData(contactData: Axis.Pollux.Domain.ContactData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<void>('/api/profiles/contact-data', contactData, config).then(oprc => oprc.data);
        }

        public getCorporateData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.CorporateData[]>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.CorporateData[]>>('/api/profiles/corporate-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result.map(_cd => new Axis.Pollux.Domain.CorporateData(_cd));
                return oprc.data;
            });
        }
        public modifyCorporateData(corporateData: Axis.Pollux.Domain.CorporateData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<void>('/api/profiles/corporate-data', corporateData, config).then(oprc => oprc.data);
        }
    }
}

