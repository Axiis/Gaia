
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

    export enum ItemType {
        Product,
        Service
    }

    export enum ServiceStatus {
        Available,
        Unavailable,
        Suspended
    }

    export enum ProductStatus {
        Published,
        Reviewing
    }

    export enum OrderStatus {
        /// <summary>
        /// A brand-new order will always be in this state. This is the only point (for now) where an order may be cancelled
        /// </summary>
        Staged,

        /// <summary> as the payment is still being processed by the payment services
        /// </summary>
        ProcessingPayment,

        /// <summary>
        /// Soon after payment is confirmed, the service provider is notified that a new order has been placed by a customer.
        /// At this point, the system is awaiting acknowledgment from the service provider. Acknowledging the order begins
        /// the order-processing phase of the transaction
        /// </summary>
        AwaitingAcknowledgment,

        /// <summary>
        /// All of the intermediate processes that happens at the service provider's end will be represented by this state.
        /// "Acknowledging" an order automatically brings the order to this state.
        /// </summary>
        ServicingOrder,

        /// <summary>
        /// Once the order has been concluded, e.g, product picked up, or shipment delivered, etc, the service provider
        /// changes the status of the order to fulfilled.
        /// </summary>
        OrderFulfilled,

        /// <summary>
        /// A customer may cancel a "staged" transaction. No other action will be taken on the order.
        /// </summary>
        OrderCancelled,

        /// <summary>
        /// If some irrecoverable error happens during the life time of the order, before it is fulfilled, it is aborted.
        /// </summary>
        OrderAborted
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


    export class Farm extends GaiaEntity<number> {

        OwnerId: string;
        Owner: Axis.Pollux.Domain.User;
        Description: string;
        FarmType: FarmType;
        GeoData: string;

        BusinessAccounts: Axis.Pollux.Domain.CorporateData[] = [];
        //ContextData: ContextData[] = [];

        GeoArea(): Gaia.Utils.GeoArea {
            return Gaia.Utils.GeoArea.Parse(this.GeoData);
        }

        constructor(data?: Object) {
            super(data);

            //set default values
            if (Object.isNullOrUndefined(this.FarmType)) this.FarmType = null;
            if (Object.isNullOrUndefined(this.BusinessAccounts)) this.BusinessAccounts = [];

            if (data) {
                this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
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

    export class OrderAggregate extends GaiaEntity<number>{
        TransactionId: string;
        TimeStamp: Axis.Apollo.Domain.JsonDateTime;
        Owner: Axis.Pollux.Domain.User;
        Orders: Order[];

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.TimeStamp = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                var _orders = ((data['Orders'] || []) as Array<Object>).map(r => new Order(r));
                this.Orders.push(..._orders);
            }
        }
    }

    export class Order extends GaiaEntity<number> {
        TransactionId: string;
        Service: Service;
        Amount: number;
        TimeStamp: Axis.Apollo.Domain.JsonDateTime;

        Message: string;
        MessageTimeStamp: Axis.Apollo.Domain.JsonDateTime;

        Status: OrderStatus;

        Customer: Axis.Pollux.Domain.User;
        Merchant: Axis.Pollux.Domain.User;

        InputData: string;
        OutputData: string;

        Previous: Order;
        Next: Order;

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.Service = !Object.isNullOrUndefined(data['Service']) ? new Service(data['Service']) : null;
                this.TimeStamp = !Object.isNullOrUndefined(data['TimeStamp']) ? new Axis.Apollo.Domain.JsonDateTime(data['TimeStamp']) : null;
                this.MessageTimeStamp = !Object.isNullOrUndefined(data['MessageTimeStamp']) ? new Axis.Apollo.Domain.JsonDateTime(data['MessageTimeStamp']) : null;
                this.Customer = !Object.isNullOrUndefined(data['Customer']) ? new Axis.Pollux.Domain.User(data['Customer']) : null;
                this.Merchant = !Object.isNullOrUndefined(data['Merchant']) ? new Axis.Pollux.Domain.User(data['Merchant']) : null;

                this.Previous = !Object.isNullOrUndefined(data['Previous']) ? new Order(data['Previous']) : null;
                this.Next = !Object.isNullOrUndefined(data['Next']) ? new Order(data['Next']) : null;
            }
        }
    }

    export class Service extends GaiaEntity<number>{
        TransactionId: string;
        Title: string;
        Description: string;
        Status: ServiceStatus;
        Cost: number;
        Product: Product;
        Tags: string;
        ItemType: ItemType;

        Inputs: ServiceInterface[];
        Outputs: ServiceInterface[];

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.Product = !Object.isNullOrUndefined(this.Product) ? new Product(this.Product) : null;
                this.Inputs = !Object.isNullOrUndefined(this.Inputs) ? this.Inputs.map(r => new ServiceInterface(r)) : [];
                this.Outputs = !Object.isNullOrUndefined(this.Outputs) ? this.Outputs.map(r => new ServiceInterface(r)) : [];
            }
        }
    }

    export class Product extends GaiaEntity<number>{
        TransactionId: string;
        Title: string;
        Description: string;
        Status: ProductStatus;
        Cost: number;
        StockCount: number;
        Tags: string;
        ItemType: ItemType;

        Images: Axis.Luna.Domain.BinaryData[];
        Videos: Axis.Luna.Domain.BinaryData[];

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.Images = !Object.isNullOrUndefined(this.Images) ? this.Images.map(r => new Axis.Luna.Domain.BinaryData(r)) : [];
                this.Videos = !Object.isNullOrUndefined(this.Videos) ? this.Videos.map(r => new Axis.Luna.Domain.BinaryData(r)) : [];
            }
        }
    }

    export class ServiceInterface extends GaiaEntity<number>{
        Name: string;
        Datacontract: ServiceDataContract;

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.Datacontract = !Object.isNullOrUndefined(this.Datacontract) ? new ServiceDataContract(this.Datacontract) : null;
            }
        }
    }

    export class ServiceDataContract extends GaiaEntity<number> {
        Name: string;
        DDL: string;

        constructor(data?: Object) {
            super(data);
        }
    }

    export class ShoppingCartItem extends GaiaEntity<number>{
        ItemType: ItemType;
        ItemId: number;
        Owner: Axis.Pollux.Domain.User;
        Quantity: number;

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.Owner = !Object.isNullOrUndefined(this.Owner) ? new Axis.Pollux.Domain.User(data) : null;
            }
        }
    }

    export class ShoppingListItem extends GaiaEntity<number>{
        ItemType: ItemType;
        ItemId: number;
        Owner: Axis.Pollux.Domain.User;
        ListName: string;

        constructor(data?: Object) {
            super(data);
            if (!Object.isNullOrUndefined(data)) {
                this.Owner = !Object.isNullOrUndefined(this.Owner) ? new Axis.Pollux.Domain.User(data) : null;
            }
        }
    }
}