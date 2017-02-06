
module Gaia.Services {

    export class BlobService {
        static $inject = ['#gaia.utils.domainTransport'];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {

        }
    }

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

        public archiveUser(userId: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Utils.Operation<Axis.Pollux.Domain.User>>('/api/profiles/archives', {
                User: userId
            }, config).then(oprc => {
                oprc.data.Result = oprc.data.Result? new Axis.Pollux.Domain.User(oprc.data.Result): null;
                return oprc.data;
            });                
        }

        public createActivationVerification(userId: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Utils.Operation<Axis.Pollux.Domain.User>>('/api/profiles/activation', {
                User: userId
            }, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                return oprc.data;
            });
        }
        public verifyUserActivation(userId: string, token: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.User>> {
            return this.transport.put<Utils.Operation<Axis.Pollux.Domain.User>>('/api/profiles/activation', {
                User: userId,
                Value: token
            }, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ?  new Axis.Pollux.Domain.User(oprc.data.Result) : null;
                return oprc.data;
            });
        }

        public getUserData(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.UserData[]>> {
            return this.transport.get<Utils.Operation<Axis.Pollux.Domain.UserData[]>>('/api/profiles/data/all', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_ud => new Axis.Pollux.Domain.UserData(_ud)) : [];
                return oprc.data;
            });
        }

        public getUserDataByName(name: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.UserData>> {
            return this.transport.get<Utils.Operation<Axis.Pollux.Domain.UserData>>('/api/profiles/data', {
                Name: name
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Axis.Pollux.Domain.UserData(oprc.data.Result) : null;
                return oprc.data;
            });
        }
        public addData(data: Array<Axis.Pollux.Domain.UserData>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Utils.Operation<number[]>>('/api/profiles/data', {
                DataList: data
            }, config).then(oprc => {
                data.forEach((value, index) => {
                    if (value.EntityId <= 0) value.EntityId = oprc.data.Result[index];
                });
            });
        }
        public removeData(dataNames: Array<string>, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/data', {
                Names: dataNames
            }, config).then(oprc => oprc.data);
        }
        public updateProfileImage(blob: Utils.EncodedBinaryData, oldUrl: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<string>> {
            return this.transport.put<Utils.Operation<string>>('/api/profiles/data/image', {
                Blob: blob.RawObjectForm(),
                OldImageUri: oldUrl
            }, config);
        }


        public getBioData(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.BioData>> {
            return this.transport.get<Utils.Operation<Axis.Pollux.Domain.BioData>>('/api/profiles/bio-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? new Axis.Pollux.Domain.BioData(oprc.data.Result): null;
                return oprc.data;
            });
        }
        public modifyBioData(biodata: Axis.Pollux.Domain.BioData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Utils.Operation<number>>('/api/profiles/bio-data', biodata, config).then(oprc => {
                if (!biodata.EntityId || biodata.EntityId <= 0) biodata.EntityId = oprc.data.Result;
            });
        }


        public getContactData(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Array<Axis.Pollux.Domain.ContactData>>> {
            return this.transport.get<Utils.Operation<Axis.Pollux.Domain.ContactData[]>>('/api/profiles/contact-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Axis.Pollux.Domain.ContactData(_cd)) : null;
                return oprc.data;
            });
        }
        public addContactData(contactData: Axis.Pollux.Domain.ContactData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Utils.Operation<number>>('/api/profiles/contact-data', contactData, config).then(oprc => {
                contactData.EntityId = oprc.data.Result;
            });
        }
        public modifyContactData(contactData: Axis.Pollux.Domain.ContactData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Utils.Operation<void>>('/api/profiles/contact-data', contactData, config).then(oprc => { });
        }
        public persistContactData(contactData: Axis.Pollux.Domain.ContactData): ng.IPromise<void> {
            if (!contactData.EntityId || contactData.EntityId <= 0) return this.addContactData(contactData);
            else return this.modifyContactData(contactData);
        }
        public removeContactData(ids: number[], config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/contact-data/?ids=' + ids.join(','), null, config).then(oprc => oprc.data);
        }


        public getCorporateData(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Axis.Pollux.Domain.CorporateData[]>> {
            return this.transport.get<Utils.Operation<Axis.Pollux.Domain.CorporateData[]>>('/api/profiles/corporate-data', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Axis.Pollux.Domain.CorporateData(_cd)): null;
                return oprc.data;
            });
        }
        public addCorporateData(corporateData: Axis.Pollux.Domain.CorporateData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Utils.Operation<number>>('/api/profiles/corporate-data', corporateData, config).then(oprc => {
                corporateData.EntityId = oprc.data.Result;
            });
        }
        public modifyCorporateData(corporateData: Axis.Pollux.Domain.CorporateData, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Utils.Operation<number>>('/api/profiles/corporate-data', corporateData, config).then(oprc => { });
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

        public getFarmAccounts(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.Farm[]>> {
            return this.transport.get<Utils.Operation<Gaia.Domain.Farm[]>>('/api/profiles/farm-account', null, config).then(oprc => {
                oprc.data.Result = oprc.data.Result ? oprc.data.Result.map(_cd => new Gaia.Domain.Farm(_cd)) : null;
                return oprc.data;
            });
        }

        public addFarmAccount(FarmAccount: Gaia.Domain.Farm, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.post<Utils.Operation<number>>('/api/profiles/farm-account', FarmAccount, config).then(oprc => {
                FarmAccount.EntityId = oprc.data.Result;
            });
        }

        public modifyFarmAccount(FarmAccount: Gaia.Domain.Farm, config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.put<Utils.Operation<void>>('/api/profiles/farm-account', FarmAccount, config).then(oprc => { });
        }

        public persistFarm(data: Gaia.Domain.Farm): ng.IPromise<void> {
            if (!data.EntityId || data.EntityId <= 0) return this.addFarmAccount(data);
            else return this.modifyFarmAccount(data);
        }

        public removeFarm(ids: number[], config?: ng.IRequestShortcutConfig): ng.IPromise<void> {
            return this.transport.delete<void>('/api/profiles/farm-account/?ids=' + ids.join(','), null, config).then(oprc => oprc.data);
        }


        static $inject = ["#gaia.utils.domainTransport"];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
        }

    }

    export class AccessProfileService {

        public createFeatureAccessProfile(profileCode: string, title: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.FeatureAccessProfile>> {
            return this.transport.post<Utils.Operation<Gaia.Domain.FeatureAccessProfile>>('/api/access-profiles', {
                Code: profileCode,
                Title: title
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.FeatureAccessProfile(oprc.data.Result) : null;
                return oprc.data;
            });
        }


        public modifyFeatureAccessProfile(profile: Gaia.Domain.FeatureAccessProfile,
            grantedDescriptors: string[], deniedDescriptors: string[], config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.FeatureAccessProfile>> {
            return this.transport.put<Utils.Operation<Gaia.Domain.FeatureAccessProfile>>('/api/access-profiles', {
                Profile: profile,
                Granted: grantedDescriptors,
                Denied: deniedDescriptors
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.FeatureAccessProfile(oprc.data.Result) : null;
                return oprc.data;
            });
        }


        public archiveAccessProfile(profileId: number, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<void>> {
            return this.transport.put<Utils.Operation<void>>('/api/access-profiles/archives', { Id: profileId }, config);
        }


        public applyAccessProfile(userId: string, accessProfileCode: string, expiryDate?: Axis.Apollo.Domain.JsonDateTime,
            config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.UserAccessProfile>> {
            return this.transport.put<Utils.Operation<Gaia.Domain.UserAccessProfile>>('/api/access-profiles/applications', {
                UserId: userId,
                Code: accessProfileCode,
                ExpiryDate: expiryDate
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.UserAccessProfile(oprc.data.Result) : null;
                return oprc.data;
            });
        }


        public revokeAccessProfile(userId: string, accessProfileCode: string,
            config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.UserAccessProfile>> {
            return this.transport.delete<Utils.Operation<Gaia.Domain.UserAccessProfile>>('/api/access-profiles', {
                UserId: userId,
                Code: accessProfileCode
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.UserAccessProfile(oprc.data.Result) : null;
                return oprc.data;
            });
        }


        public migrateAccessProfile(userId: string, oldAccessProfileCode: string, newAccessProfileCode: string,
            newExpiry?: Axis.Apollo.Domain.JsonDateTime, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.UserAccessProfile>> {
            return this.transport.delete<Utils.Operation<Gaia.Domain.UserAccessProfile>>('/api/access-profiles/migrations', {
                UserId: userId,
                OldAccessProfileCode: oldAccessProfileCode,
                NewAccessProfileCode: newAccessProfileCode,
                NewExpiry: newExpiry
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ? new Gaia.Domain.UserAccessProfile(oprc.data.Result) : null;
                return oprc.data;
            });
        }


        public activeUserAccessProfiles(userId: string, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Gaia.Domain.UserAccessProfile[]>> {
            return this.transport.get<Utils.Operation<Gaia.Domain.UserAccessProfile[]>>('/api/access-profiles/active', {
                UserId: userId
            }, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ?
                    oprc.data.Result.map(_r => new Gaia.Domain.UserAccessProfile(_r)) : [];
                return oprc.data;
            });
        }
        

        static $inject = ["#gaia.utils.domainTransport"];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
        }
    }

    export class MarketPlaceService {

        ///Merchant
        getProductCategories(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Domain.ProductCategory[]>> {
            return this.transport.get<Utils.Operation<Domain.ProductCategory[]>>('/api/market-place/merchants/product-categories', null, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ?
                    oprc.data.Result.map(_r => new Domain.ProductCategory(_r)) : [];
                return oprc.data;
            });
        }

        getServiceCategories(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Domain.ServiceCategory[]>> {
            return this.transport.get<Utils.Operation<Domain.ServiceCategory[]>>('/api/market-place/merchants/service-categories', null, config).then(oprc => {
                oprc.data.Result = !Object.isNullOrUndefined(oprc.data.Result) ?
                    oprc.data.Result.map(_r => new Domain.ServiceCategory(_r)) : [];
                return oprc.data;
            });
        }

        findMerchantProducts(searchString: string, pageSize: number, pageIndex: number, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<Utils.SequencePage<Domain.Product>>> {
            return this.transport.get<Utils.Operation<Utils.SequencePage<Domain.Product>>>('/api/market-place/merchant/products', {
                SearchString: searchString,
                PageIndex: pageIndex,
                PageSize: pageSize
            }, config).then(oprc => {
                if (Object.isNullOrUndefined(oprc.data.Result)) oprc.data.Result = new Utils.SequencePage([], 0);
                else oprc.data.Result = new Utils.SequencePage<Domain.Product>(
                    oprc.data.Result.Page.map(_p => new Domain.Product(_p)),
                    oprc.data.Result.SequenceLength,
                    oprc.data.Result.PageSize,
                    oprc.data.Result.PageIndex);
                return oprc.data;
            });
        }


        findMerchantServices(searchString: string, pageSize: number, pageIndex: number, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<Utils.SequencePage<Domain.Service>>> {
            return this.transport.get<Utils.Operation<Utils.SequencePage<Domain.Service>>>('/api/market-place/merchant/services', {
                SearchString: searchString,
                PageIndex: pageIndex,
                PageSize: pageSize
            }, config).then(oprc => {
                if (Object.isNullOrUndefined(oprc.data.Result)) oprc.data.Result = new Utils.SequencePage([], 0);
                else oprc.data.Result = new Utils.SequencePage<Domain.Service>(
                    oprc.data.Result.Page.map(_s => new Domain.Service(_s)),
                    oprc.data.Result.SequenceLength,
                    oprc.data.Result.PageSize,
                    oprc.data.Result.PageIndex);
                return oprc.data;
            });
            //return this.$q.resolve(new Utils.Operation<Utils.SequencePage<Domain.Service>>({
            //    Succeeded: true,
            //    Result: new Utils.SequencePage<Domain.Service>([new Domain.Service({
            //        TransactionId: '0000-0000000-0000',
            //        Title: 'Mega Man X',
            //        Description: 'the mega-est man alive',
            //        Status: Domain.ServiceStatus.Available,
            //        Cost: 49.99,
            //        ItemType: Domain.ItemType.Service,
            //        $nascent: true,

            //        Inputs: [],
            //        Outputs: []
            //    }), new Domain.Service({
            //        TransactionId: '0000-0000000-0000',
            //        Title: 'Trinidad',
            //        Description: 'battle of the worlds',
            //        Status: Domain.ServiceStatus.Suspended,
            //        Cost: 22.30,
            //        ItemType: Domain.ItemType.Service,

            //        Inputs: [],
            //        Outputs: []
            //    }), new Domain.Service({
            //        TransactionId: '0000-0000000-0000',
            //        Title: 'Drizzt',
            //        Description: 'dark elf drow race',
            //        Status: Domain.ServiceStatus.Unavailable,
            //        Cost: 85.99,
            //        ItemType: Domain.ItemType.Service,

            //        Inputs: [],
            //        Outputs: []
            //    })], 3)
            //}));
        }

        getMerchantOrders(pageIndex: number, pageSize: number, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<Utils.SequencePage<Domain.Order>>> {
            return this.transport.get<Utils.Operation<Utils.SequencePage<Domain.Order>>>('/api/market-place/merchants/orders', {
                PageIndex: pageIndex,
                PageSize: pageSize
            }, config).then(oprc => {
                if (Object.isNullOrUndefined(oprc.data.Result)) oprc.data.Result = new Utils.SequencePage<Domain.Order>([], 0);
                else oprc.data.Result = new Utils.SequencePage<Domain.Order>(
                    oprc.data.Result.Page.map(_o => new Domain.Order(_o)),
                    oprc.data.Result.SequenceLength,
                    oprc.data.Result.PageSize,
                    oprc.data.Result.PageIndex);
                return oprc.data;
            });
        }

        modifyOrder(order: Gaia.Domain.Order, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<void>> {
            return this.transport.put<Utils.Operation<void>>('/api/market-place/merchants/orders', order, config).then(opr => opr.data);
        }
        
        fulfillOrder(order: Gaia.Domain.Order, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<void>> {
            return this.transport.put<Utils.Operation<void>>('/api/market-place/merchants/orders/fulfilled', order, config).then(opr => opr.data);
        }

        addService(service: Gaia.Domain.Service, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<number>> {
            return this.transport.post<Utils.Operation<number>>('/api/market-place/merchants/services', service, config).then(opr => opr.data);
        }

        modifyService(service: Gaia.Domain.Service, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<void>> {
            return this.transport.put<Utils.Operation<void>>('/api/market-place/merchants/services', service, config).then(opr => opr.data);
        }
        
        addServiceInterface(sinterface: Gaia.Domain.ServiceInterface, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<number>> {
            return this.transport.post<Utils.Operation<number>>('/api/market-place/merchants/services-interfaces', sinterface, config).then(opr => opr.data);
        }

        addProduct(product: Gaia.Domain.Product, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<number>> {
            return this.transport.post<Utils.Operation<number>>('/api/market-place/merchants/products', product, config).then(opr => opr.data);
        }
        modifyProduct(product: Gaia.Domain.Product, config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<void>> {
            return this.transport.put<Utils.Operation<void>>('/api/market-place/merchants/products', product, config).then(opr => opr.data);
        }
        ///end-Merchant

        /// Customer

        findCustomerProduct(searchString: string, pageSize: number, pageIndex: number, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<Utils.SequencePage<Domain.Product>>> {
            return this.transport.get<Utils.Operation<Utils.SequencePage<Domain.Product>>>('/api/market-place/customer/products', {
                SearchString: searchString,
                PageIndex: pageIndex,
                PageSize: pageSize
            }, config).then(oprc => {
                if (Object.isNullOrUndefined(oprc.data.Result)) oprc.data.Result = new Utils.SequencePage([], 0);
                else oprc.data.Result = new Utils.SequencePage<Domain.Product>(
                    oprc.data.Result.Page.map(_p => new Domain.Product(_p)),
                    oprc.data.Result.SequenceLength,
                    oprc.data.Result.PageSize,
                    oprc.data.Result.PageIndex);
                return oprc.data;
            });
        }


        findCustomerService(searchString: string, pageSize: number, pageIndex: number, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<Utils.SequencePage<Domain.Service>>> {
            return this.transport.get<Utils.Operation<Utils.SequencePage<Domain.Service>>>('/api/market-place/customer/services', {
                SearchString: searchString,
                PageIndex: pageIndex,
                PageSize: pageSize
            }, config).then(oprc => {
                if (Object.isNullOrUndefined(oprc.data.Result)) oprc.data.Result = new Utils.SequencePage([], 0);
                else oprc.data.Result = new Utils.SequencePage<Domain.Service>(
                    oprc.data.Result.Page.map(_s => new Domain.Service(_s)),
                    oprc.data.Result.SequenceLength,
                    oprc.data.Result.PageSize,
                    oprc.data.Result.PageIndex);
                return oprc.data;
            });
        }



        getShoppingLists(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<string[]>> {
            return this.transport.get<Utils.Operation<string[]>>('/api/merket-place/customer/shopping-list', null, config).then(opr => opr.data);
        }
        
        addToBasket(itemId: number, type: Gaia.Domain.ItemType, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<number>> {
            return this.transport.put<Utils.Operation<number>>('/api/merket-place/customer/cart', {
                ItemId: itemId,
                ItemType: type
            }, config);
        }
        
        removeFromBasket(baskeItemId: number, config?: ng.IRequestShortcutConfig)
            : ng.IPromise<Utils.Operation<void>> {
            return this.transport.delete<Utils.Operation<void>>('/api/merket-place/customer/cart', {
                ItemId: baskeItemId,
            }, config);
        }
        
        addToList(listName: string, itemId: number, type: Domain.ItemType, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<number>> {
            return this.transport.put<Utils.Operation<void>>('/api/merket-place/customer/list', {
                ItemId: itemId,
                ItemType: type,
                ListName: listName
            }, config);
        }

        removeFromList(listName: string, itemId: number, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<void>> {
            return this.transport.delete<Utils.Operation<void>>('/api/merket-place/customer/list', {
                ItemId: itemId,
                ListName: listName
            }, config);
        }
        
        checkout(config?: ng.IRequestShortcutConfig): ng.IPromise<Utils.Operation<void>> {
            return this.transport.post<Utils.Operation<void>>('/api/market-place/customer/cart/checkout', null, config).then(opr => opr.data);
        }

        getCustomerOrders(pageIndex: number, pageSize: number, config?: ng.IRequestShortcutConfig):
            ng.IPromise<Utils.Operation<Utils.SequencePage<Gaia.Domain.Order>>> {
            return this.transport.get<Utils.Operation<Utils.SequencePage<Domain.Order>>>('/api/market-place/customer/orders', {
                PageIndex: pageIndex,
                PageSize: pageSize
            }, config).then(oprc => {
                if (Object.isNullOrUndefined(oprc.data.Result)) oprc.data.Result = new Utils.SequencePage([], 0);
                else oprc.data.Result = new Utils.SequencePage<Domain.Order>(
                    oprc.data.Result.Page.map(_o => new Domain.Order(_o)),
                    oprc.data.Result.SequenceLength,
                    oprc.data.Result.PageSize,
                    oprc.data.Result.PageIndex);
                return oprc.data;
            });
        }
        ///end-Customer


        static $inject = ["#gaia.utils.domainTransport", '$q'];
        constructor(private transport: Gaia.Utils.Services.DomainTransport, private $q: ng.IQService) {
        }
    }
}

