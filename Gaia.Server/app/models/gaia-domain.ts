
module Gaia.Domain {

    export enum AdvertStatus {
        Draft,
        Review,
        Published,
        Archived,
        Suspended
    }

    export enum AdvertMediaType {
        Video,

        Image
    }

    export enum AccessPermission {
        Grant,
        Deny
    }

    export enum FeatureAccessProfileStatus {
        Active,
        Archived
    }

    export enum ForumThreadStatus {
        Open,
        Closed,
        Flagged
    }

    export enum ForumTopicStatus {
        Open,
        Closed,
        Flagged
    }

    export enum NotificationStatus {
        Seen,
        Unseen
    }

    export enum PostStatus {
        Private,
        Published,
        Archived
    }

    export enum CommonDataType {
        String,
        Intereger,
        Float,
        Boolean,
        Binary,

        DateTime,
        TimeSpan,
        Url,

        Object
    }

    export enum FarmType {
        Other,
        Crop,
        Livestock,
        Mixed
    }

    export enum ServiceType {
        Other
    }


    export class GaiaEntity<Key>{
        EntityId: Key;
        CreatedBy: string;
        ModifiedBy: string;

        CreatedOn: Axis.Apollo.Domain.JsonDateTime;
        ModifiedOn: Axis.Apollo.Domain.JsonDateTime;

        constructor(data?: Object) {
            if (data) {
                data.copyTo(this);

                this.CreatedOn = data['CreatedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['CreatedOn']) : null;
                this.ModifiedOn = data['ModifiedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ModifiedOn']) : null;
            }
        }
    }


    export class FarmAccount extends GaiaEntity<number> {

        OwnerId: string = null;
        Owner: Axis.Pollux.Domain.User = null;
        Description: string = null;
        FarmType: FarmType = null;
        GeoData: string = null;

        BusinessAccounts: Axis.Pollux.Domain.CorporateData[] = [];
        //ContextData: ContextData[] = [];

        GeoArea(): Gaia.Utils.GeoArea {
            return Gaia.Utils.GeoArea.Parse(this.GeoData);
        }

        constructor(data?: Object) {
            super(data);

            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class ServiceAccount extends GaiaEntity<number>{

        OwnerId: string = null;
        Owner: Axis.Pollux.Domain.User = null;
        Description: string = null;
        ServiceType: ServiceType = null;

        BusinessAccounts: Axis.Pollux.Domain.CorporateData[] = [];
        //ContextData: ContextData[] = [];

        constructor(data?: Object) {
            super(data);

            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                this.BusinessAccounts = (data['BusinessAccounts'] as Array<any> || [])
                    .map(v => new Axis.Pollux.Domain.CorporateData(v));
            }
        }
    }

    export class FeatureURI extends GaiaEntity<number>{
        URI: string;
        Name: string;

        constructor(data?: Object) {
            super(data);

            if (data) {
            }
        }
    }

    export class ProductCategory extends GaiaEntity<number>{
        Title: string;
        Description: string;

        constructor(data?: Object) {
            super(data);

            if (data) {
            }
        }
    }

    export class ServiceCategory extends GaiaEntity<number>{
        Title: string;
        Description: string;

        constructor(data?: Object) {
            super(data);
            if (data) {
            }
        }
    }

    export class Advert extends GaiaEntity<number>{
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        MediaURI: string;
        MediaType: AdvertMediaType;
        TargetDemographic: string;
        Status: AdvertStatus;
        ServiceTags: string;
        ExpiresOn: Axis.Apollo.Domain.JsonDateTime;
        get IsExpired(): boolean { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); }

        Services(): Array<string> {
            return (this.ServiceTags || '')
                .split(',')
                .project(v => Lazy(v as string[]))
                .map(_item => _item.trimLeft('[').trimRight(']').trim())
                .toArray();
        }

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class AdvertHit extends GaiaEntity<number>{
        HitCount: number;
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        AdvertId: number;
        Advert: Advert;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class Comment extends GaiaEntity<number>{
        ContextId: number;
        ContextType: string;
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        Text: string;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class ContextVerification extends GaiaEntity<number>{
        User: Axis.Pollux.Domain.User;
        UserId: string;
        VerificationToken: string;
        Verified: boolean;
        Context: string;
        ExpiresOn: Axis.Apollo.Domain.JsonDateTime;
        get IsExpired(): boolean { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); }

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.ExpiresOn = data['ExpiresOn']? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                this.User = data['User'] ? new Axis.Pollux.Domain.User(data['User']) : null;
            }
        }
    }

    export class FarmInfo extends GaiaEntity<number>{
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        BusinessName: string;
        Produce: string;
        Address: string;
        GpsAreaPonumbers: string;
        VideoLinks: string;
        PhotoLinks: string;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class FeatureAccessDescriptor extends GaiaEntity<number>{
        AccessDescriptor: string;
        AccessProfileCode: string;
        Permission: AccessPermission;

        constructor(data?: Object) {
            super(data);
            if (data) {
            }
        }
    }

    export class FeatureAccessProfile extends GaiaEntity<number>{
        AccessCode: string;
        Title: string;
        Description: string;
        Status: FeatureAccessProfileStatus;
        AccessDescriptors: Array<FeatureAccessDescriptor> = [];

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.AccessDescriptors =  (data['AccessDescriptors'] as Array<any> || []).map(v => {
                    return new FeatureAccessDescriptor(v);
                });
            }
            this.AccessCode = this.AccessCode || Gaia.Utils.NewGuid();
        }
    }

    export class FeedEntry {
        EntryType: string;
        EntryId: string;

        Title: string;
        Content: string;
        Metadata: any;

        CreatedOn: Axis.Apollo.Domain.JsonDateTime;
        ModifiedOn: Axis.Apollo.Domain.JsonDateTime;

        constructor(data?: Object) {
            if (data) {
                this.CreatedOn = data['CreatedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['CreatedOn']) : null;
                this.ModifiedOn = data['ModifiedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ModifiedOn']) : null;
            }
        }
    }

    export class PinnedFeedEntry extends FeedEntry {
        PinId: number;

        PinnedOn: Axis.Apollo.Domain.JsonDateTime;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.PinnedOn = data['PinnedOn']? new Axis.Apollo.Domain.JsonDateTime(data['PinnedOn']) : null;
            }
        }
    }

    export class ForumThread extends GaiaEntity<number>{
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        Title: string;
        Content: string;
        TopicId: number;
        Status: ForumThreadStatus;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class ForumThreadWatch extends GaiaEntity<number>{
        ThreadId: number;
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class ForumTopic extends GaiaEntity<number>{
        Title: string;
        Description: string;
        Status: ForumTopicStatus;

        constructor(data?: Object) {
            super(data);
            if (data) {
            }
        }
    }

    export class Notification extends GaiaEntity<number>{
        TargetUserId: string;
        TargetUser: Axis.Pollux.Domain.User;
        Title: string;
        Message: string;
        ContextType: string;
        ContextId: number; //<-- this should be number
        Status: NotificationStatus;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.TargetUser = data['TargetUser'] ? new Axis.Pollux.Domain.User(data['TargetUser']) : null;
            }
        }
    }

    export class PinnedFeed extends GaiaEntity<number>{
        ContextType: string;
        ContextId: number;
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class Post extends GaiaEntity<number>{

        Title: string;
        Message: string;
        Status: PostStatus;
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        ParentPostId: number;
        TargetDemographic: string;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class Rating extends GaiaEntity<number>{
        ContextId: number;
        ContextType: string;
        Score: number;
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class ServiceInfo extends GaiaEntity<number>{
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        ServiceName: string;
        Description: string;
        VideoLinks: string;
        PhotoLinks: string;
        Category: ServiceCategory;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                this.Category = data['Category'] ? new Gaia.Domain.ServiceCategory(data['Category']) : null;
            }
        }
    }

    export class SystemSetting extends GaiaEntity<number>{

        Data: string;
        Name: string;
        Type: CommonDataType;

        constructor(data?: Object) {
            super(data);
            if (data) {
            }
        }
    }

    export class UserAccessProfile extends GaiaEntity<number> {

        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        AccessProfileCode: string;
        FeatureProfile: FeatureAccessProfile;
        UserCancelled: boolean;
        ExpiresOn: Axis.Apollo.Domain.JsonDateTime;
        get IsExpired(): boolean { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); }

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.ExpiresOn = data['ExpiresOn']? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }

    export class UserReaction extends GaiaEntity<number>{
        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        ContextId: number;
        ContextType: string;
        Reaction: string;

        constructor(data?: Object) {
            super(data);
            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
            }
        }
    }
}