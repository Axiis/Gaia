
module Axis.Pollux.Domain {

    export enum Access {
        Public,
        Secret
    }

    export enum Gender {
        Female,
        Male,
        Other
    }


    export class PolluxEntity<Key>{

        EntityId: Key;

        CreatedOn: Axis.Apollo.Domain.JsonDateTime;
        ModifiedOn: Axis.Apollo.Domain.JsonDateTime;

        constructor(data?: Object) {
            if (data) {
                data.copyTo(this);

                this.CreatedOn = new Axis.Apollo.Domain.JsonDateTime(data['CreatedOn']);
                this.ModifiedOn = new Axis.Apollo.Domain.JsonDateTime(data['ModifiedOn']);
            }
        }
    }

    export class AddressData extends PolluxEntity<number> {

        Street: string;
        City: string;
        StateProvince: string;
        Country: string;

        OwnerId: string;
        Owner: User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                data.copyTo(this);

                this.Owner = data['Owner'] ? new User(data['Owner']) : null;
            }
        }
    }

    export class BioData extends PolluxEntity<number>{

        FirstName: string;
        MiddleName: string;
        LastName: string;

        Dob: Axis.Apollo.Domain.JsonDateTime;

        Gender: Gender;

        Nationality: string;
        StateOfOrigin: string;

        OwnerId: string;
        Owner: User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                data.copyTo(this);

                this.Dob = new Axis.Apollo.Domain.JsonDateTime(data['Dob']);
                this.Owner = data['Owner'] ? new User(data['Owner']) : null;
            }
        }
    }

    export class ContactData extends PolluxEntity<number>{

        Phone: string;
        AlternatePhone: string;
        PhoneConfirmed: boolean;

        Email: string;
        AlternateEmail: string;
        EmailConfirmed: boolean;

        OwnerId: string;
        Owner: User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                data.copyTo(this);

                this.Owner = data['Owner'] ? new User(data['Owner']) : null;
            }
        }
    }

    export class CorporateData extends PolluxEntity<number>{

        CorporateName: string;
        CorporateId: string;

        OwnerId: string;
        Owner: User;

        IncorporationDate: Axis.Apollo.Domain.JsonDateTime;

        constructor(data?: Object) {
            super(data);
            if (data) {
                data.copyTo(this);

                this.IncorporationDate = new Axis.Apollo.Domain.JsonDateTime(data['IncorporationDate']);
                this.Owner = data['Owner'] ? new User(data['Owner']) : null;
            }
        }
    }

    export class User extends PolluxEntity<string>{

        UserId: string;
        Stataus: number;
        Guid: string;

        constructor(data?: Object) {
            super(data);
            if (data) data.copyTo(this);
        }
    }

    export class UserData extends PolluxEntity<number>{

        StringData: string;
        BinaryData: string;
        Name: string;

        OwnerId: string;
        Owner: User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                data.copyTo(this);

                this.Owner = data['Owner'] ? new User(data['Owner']) : null;
            }
        }
    }

    export class CredentialMetadata {

        constructor(public Name: string, public Access: Access) {
        }
    }

    export class Credential extends PolluxEntity<number>{

        Metadata: CredentialMetadata;
        Value: string;
        SecuredHash: string;
        Tags: string;

        Expires: Axis.Apollo.Domain.JsonTimeSpan;

        OwnerId: string;
        Owner: User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                data.copyTo(this);

                this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                this.Expires = data['Expires'] ? new Axis.Apollo.Domain.JsonTimeSpan(data['Expires']) : null;
            }
        }
    }
}