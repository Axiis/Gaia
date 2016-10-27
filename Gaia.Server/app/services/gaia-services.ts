
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
                oprc.data.Result = oprc.data.Result? new Axis.Pollux.Domain.User(oprc.data.Result): null;
                return oprc.data;
            });                
        }

        public createActivationVerification(userId: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>>('/api/profiles/activation', {
                User: userId
            }, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                return oprc.data;
            });
        }
        public verifyUserActivation(userId: string, token: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.User>>('/api/profiles/activation', {
                User: userId,
                Value: token
            }, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ?  new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                return oprc.data;
            });
        }

        public getUserData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Array<Axis.Pollux.Domain.UserData>>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Array<Axis.Pollux.Domain.UserData>>>('/api/profiles/data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_ud => new Axis.Pollux.Domain.UserData(_ud)) : [];
                return oprc.data;
            });
        }
        public addData(data: Array<Axis.Pollux.Domain.UserData>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Axis.Luna.Domain.Operation<number[]>>('/api/profiles/data', {
                DataList: data
            }, config).then(oprc => {
                data.forEach((value, index) => {
                    if (value.EntityId <= 0) value.EntityId = oprc.data.Result[index];
                });
            });
        }
        public removeData(dataNames: Array<string>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/data/?dataNames=' + dataNames.join(','), null, config)
                .then(oprc => oprc.data);
        }


        public getBioData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.BioData>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.BioData>>('/api/profiles/bio-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.BioData(oprc.data.Result): null;
                return oprc.data;
            });
        }
        public modifyBioData(biodata: Axis.Pollux.Domain.BioData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Axis.Luna.Domain.Operation<number>>('/api/profiles/bio-data', biodata, config).then(oprc => {
                if (!biodata.EntityId || biodata.EntityId <= 0) biodata.EntityId = oprc.data.Result;
            });
        }


        public getContactData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Array<Axis.Pollux.Domain.ContactData>>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.ContactData[]>>('/api/profiles/contact-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Axis.Pollux.Domain.ContactData(_cd)) : null;
                return oprc.data;
            });
        }
        public addContactData(contactData: Axis.Pollux.Domain.ContactData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Axis.Luna.Domain.Operation<number>>('/api/profiles/contact-data', contactData, config).then(oprc => {
                contactData.EntityId = oprc.data.Result;
            });
        }
        public modifyContactData(contactData: Axis.Pollux.Domain.ContactData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Axis.Luna.Domain.Operation<void>>('/api/profiles/contact-data', contactData, config).then(oprc => { });
        }
        public persistContactData(contactData: Axis.Pollux.Domain.ContactData): ng.IPromise<void> {
            if (!contactData.EntityId || contactData.EntityId <= 0) return this.addContactData(contactData);
            else return this.modifyContactData(contactData);
        }
        public removeContactData(ids: number[], config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/contact-data/?ids=' + ids.join(','), null, config).then(oprc => oprc.data);
        }


        public getCorporateData(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.CorporateData[]>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Axis.Pollux.Domain.CorporateData[]>>('/api/profiles/corporate-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Axis.Pollux.Domain.CorporateData(_cd)): null;
                return oprc.data;
            });
        }
        public addCorporateData(corporateData: Axis.Pollux.Domain.CorporateData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Axis.Luna.Domain.Operation<number>>('/api/profiles/corporate-data', corporateData, config).then(oprc => {
                corporateData.EntityId = oprc.data.Result;
            });
        }
        public modifyCorporateData(corporateData: Axis.Pollux.Domain.CorporateData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Axis.Luna.Domain.Operation<number>>('/api/profiles/corporate-data', corporateData, config).then(oprc => { });
        }
        public persistCorporateData(data: Axis.Pollux.Domain.CorporateData): ng.IPromise<void> {
            if (!data.EntityId || data.EntityId <= 0) return this.addCorporateData(data);
            else return this.modifyCorporateData(data);
        }
        public removeCorporateData(ids: number[], config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/corporate-data/?ids=' + ids.join(','), null, config).then(oprc => oprc.data);
        }
    }

    export class UserAccountService {

        public getServiceAccounts(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Gaia.Domain.ServiceAccount[]>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Gaia.Domain.ServiceAccount[]>>('/api/profiles/service-account', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Gaia.Domain.ServiceAccount(_cd)) : null;
                return oprc.data;
            });
        }
        public addServiceAccount(serviceAccount: Gaia.Domain.ServiceAccount, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Axis.Luna.Domain.Operation<number>>('/api/profiles/service-account', serviceAccount, config).then(oprc => {
                serviceAccount.EntityId = oprc.data.Result;
            });
        }
        public modifyServiceAccount(serviceAccount: Gaia.Domain.ServiceAccount, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Axis.Luna.Domain.Operation<void>>('/api/profiles/service-account', serviceAccount, config).then(oprc => { });
        }
        public persistServiceAccount(data: Gaia.Domain.ServiceAccount): ng.IPromise<void> {
            if (!data.EntityId || data.EntityId <= 0) this.addServiceAccount(data);
            else return this.modifyServiceAccount(data);
        }
        public removeServiceAccount(ids: number[], config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/service-account/?ids=' + ids.join(','), null, config).then(oprc => oprc.data);
        }


        public getFarmAccounts(config?: ng.IRequestShortcutConfig): ng.IPromise<Axis.Luna.Domain.Operation<Gaia.Domain.FarmAccount[]>> {
            return this.transport.get<Axis.Luna.Domain.Operation<Gaia.Domain.FarmAccount[]>>('/api/profiles/farm-account', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Gaia.Domain.FarmAccount(_cd)) : null;
                return oprc.data;
            });
        }
        public addFarmAccount(FarmAccount: Gaia.Domain.FarmAccount, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Axis.Luna.Domain.Operation<number>>('/api/profiles/farm-account', FarmAccount, config).then(oprc => {
                FarmAccount.EntityId = oprc.data.Result;
            });
        }
        public modifyFarmAccount(FarmAccount: Gaia.Domain.FarmAccount, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Axis.Luna.Domain.Operation<void>>('/api/profiles/farm-account', FarmAccount, config).then(oprc => { });
        }
        public persistFarmAccount(data: Gaia.Domain.FarmAccount): ng.IPromise<void> {
            if (!data.EntityId || data.EntityId <= 0) this.addFarmAccount(data);
            else return this.modifyFarmAccount(data);
        }
        public removeFarmAccount(ids: number[], config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/farm-account/?ids=' + ids.join(','), null, config).then(oprc => oprc.data);
        }


        static $inject = ["#gaia.utils.domainTransport"];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
        }

    }
}

