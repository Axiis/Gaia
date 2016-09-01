﻿
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

    export enum Gender {
        Female,
        Male,
        Other
    }

    export enum Access {
        Public,
        Secret
    }

    export class GaiaEntity<Key>{
        EntityId: Key;
        CreatedBy: string;
        ModifiedBy: string;

        private _createdOn: Date;
        get CreatedOn(): Date {
            return this._createdOn;
        }
        set CreatedOn(value: Date) {
            if (value instanceof String) this._createdOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._createdOn = value;
            else throw 'invalid date value';
        }

        private _modifiedOn: Date;
        get ModifiedOn(): Date {
            return this._modifiedOn;
        }
        set ModifiedOn(value: Date) {
            if (value instanceof String) this._modifiedOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._modifiedOn = value;
            else throw 'invalid date value';
        }
    }

    export class FeatureURI extends GaiaEntity<number>{
        URI: string;
        Name: string;
    }

    export class ProductCategory extends GaiaEntity<number>{
        Title: string;
        Description: string;
    }

    export class ServiceCategory extends GaiaEntity<number>{
        Title: string;
        Description: string;
    }

    export class Advert extends GaiaEntity<number>{
        OwnerId: string;
        Owner: User;
        MediaURI: string;
        MediaType: AdvertMediaType;
        TargetDemographic: string;
        Status: AdvertStatus;
        ServiceTags: string;

        private _expiresOn: Date;
        get ExpiresOn(): Date {
            return this._expiresOn;
        }
        set ExpiresOn(value: Date) {
            if (value instanceof String) this._expiresOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._expiresOn = value;
            else throw 'invalid date value';
        }
        get IsExpired(): boolean { return Date.now() > this.ExpiresOn.valueOf(); }

        Services(): Array<string> {
            return (this.ServiceTags || '')
                .split(',')
                .pipe(v => Lazy(v as string[]))
                .map(_item => _item.trimLeft('[').trimRight(']').trim())
                .toArray();
        }

        constructor() {
            super();
            this.Status = AdvertStatus.Draft;
        }
    }

    export class AdvertHit extends GaiaEntity<number>{
        HitCount: number;
        OwnerId: string;
        Owner: User;
        AdvertId: number;
        Advert: Advert;
    }

    export class Comment extends GaiaEntity<number>{
        ContextId: number;
        ContextType: string;
        OwnerId: string;
        Owner: User;
        Text: string;
    }

    export class ContextVerification extends GaiaEntity<number>{
        User: User;
        UserId: string;
        VerificationToken: string;
        Verified: boolean;
        Context: string;

        private _expiresOn: Date;
        get ExpiresOn(): Date {
            return this._expiresOn;
        }
        set ExpiresOn(value: Date) {
            if (value instanceof String) this._expiresOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._expiresOn = value;
            else throw 'invalid date value';
        }
    }

    export class FarmInfo extends GaiaEntity<number>{
        OwnerId: string;
        Owner: User;
        BusinessName: string;
        Produce: string;
        Address: string;
        GpsAreaPonumbers: string;
        VideoLinks: string;
        PhotoLinks: string;
    }

    export class FeatureAccessDescriptor extends GaiaEntity<number>{
        AccessDescriptor: string;
        AccessProfileCode: string;
        Permission: AccessPermission;
    }

    export class FeatureAccessProfile extends GaiaEntity<number>{
        AccessCode: string;
        Title: string;
        Description: string;
        Status: FeatureAccessProfileStatus;
        AccessDescriptors: Array<FeatureAccessDescriptor> = [];


        constructor() {
            super();
            this.AccessCode = Gaia.Utils.NewGuid();
        }
    }

    export class FeedEntry {
        EntryType: string;
        EntryId: string;

        Title: string;
        Content: string;
        Metadata: any;


        private _createdOn: Date;
        get CreatedOn(): Date {
            return this._createdOn;
        }
        set CreatedOn(value: Date) {
            if (value instanceof String) this._createdOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._createdOn = value;
            else throw 'invalid date value';
        }

        private _modifiedOn: Date;
        get ModifiedOn(): Date {
            return this._modifiedOn;
        }
        set ModifiedOn(value: Date) {
            if (value instanceof String) this._modifiedOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._modifiedOn = value;
            else throw 'invalid date value';
        }
    }

    export class PinnedFeedEntry extends FeedEntry {
        PinId: number;

        private _pinnedOn: Date;
        get PinnedOn(): Date {
            return this._pinnedOn;
        }
        set PinnedOn(value: Date) {
            if (value instanceof String) this._pinnedOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._pinnedOn = value;
            else throw 'invalid date value';
        }
    }

    export class ForumThread extends GaiaEntity<number>{
        OwnerId: string;
        Owner: User;
        Title: string;
        Content: string;
        TopicId: number;
        Status: ForumThreadStatus;
    }

    export class ForumThreadWatch extends GaiaEntity<number>{
        ThreadId: number;
        OwnerId: string;
        Owner: User;
    }

    export class ForumTopic extends GaiaEntity<number>{
        Title: string;
        Description: string;
        Status: ForumTopicStatus;
    }

    export class Notification extends GaiaEntity<number>{
        TargetUserId: string;
        TargetUser: User;
        Title: string;
        Message: string;
        ContextType: string;
        ContextId: number; //<-- this should be number
        Status: NotificationStatus;
    }

    export class PinnedFeed extends GaiaEntity<number>{
        ContextType: string;
        ContextId: number;
        OwnerId: string;
        Owner: User;
    }

    export class Post extends GaiaEntity<number>{

        Title: string;
        Message: string;
        Status: PostStatus;
        OwnerId: string;
        Owner: User;
        ParentPostId: number;
        TargetDemographic: string;
    }

    export class Rating extends GaiaEntity<number>{
        ContextId: number;
        ContextType: string;
        Score: number;
        OwnerId: string;
        Owner: User;
    }

    export class ServiceInfo extends GaiaEntity<number>{
        OwnerId: string;
        Owner: User;
        ServiceName: string;
        Description: string;
        VideoLinks: string;
        PhotoLinks: string;
        Category: ServiceCategory;
    }

    export class SystemSetting extends GaiaEntity<number>{

        Data: string;
        Name: string;
        Type: CommonDataType;
    }

    export class UserAccessProfile extends GaiaEntity<number> {

        OwnerId: string;
        Owner: User;
        AccessProfileCode: string;
        FeatureProfile: FeatureAccessProfile;
        UserCancelled: boolean;


        private _expiresOn: Date;
        get ExpiresOn(): Date {
            return this._expiresOn;
        }
        set ExpiresOn(value: Date) {
            if (value instanceof String) this._expiresOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._expiresOn = value;
            else throw 'invalid date value';
        }
    }

    export class UserReaction extends GaiaEntity<number>{
        OwnerId: string;
        Owner: User;
        ContextId: number;
        ContextType: string;
        Reaction: string;
    }

    export class PolluxEntity<Key>{

        EntityId: Key;

        private _createdOn: Date;
        get CreatedOn(): Date {
            return this._createdOn;
        }
        set CreatedOn(value: Date) {
            if (value instanceof String) this._createdOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._createdOn = value;
            else throw 'invalid date value';
        }

        private _modifiedOn: Date;
        get ModifiedOn(): Date {
            return this._modifiedOn;
        }
        set ModifiedOn(value: Date) {
            if (value instanceof String) this._modifiedOn = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._modifiedOn = value;
            else throw 'invalid date value';
        }
    }

    export class AddressData extends PolluxEntity<number> {

        Street: string;
        City: string;
        StateProvince: string;
        Country: string;

        OwnerId: string;
        Owner: User;
    }

    export class BioData extends PolluxEntity<number>{

        FirstName: string;
        MiddleName: string;
        LastName: string;

        private _dob: Date;
        get Dob(): Date {
            return this._dob;
        }
        set Dob(value: Date) {
            if (value instanceof String) this._dob = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._dob = value;
            else throw 'invalid date value';
        }

        Gender: Gender;

        Nationality: string;
        StateOfOrigin: string;

        OwnerId: string;
        Owner: User;
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
    }

    export class CorporateData extends PolluxEntity<number>{

        CorporateName: string;
        CorporateId: string;


        private _incorporationDate: Date;
        get IncorporationDate(): Date {
            return this._incorporationDate;
        }
        set IncorporationDate(value: Date) {
            if (value instanceof String) this._incorporationDate = null;// <-- use a moment date to convert it
            else if (value instanceof Date) this._incorporationDate = value;
            else throw 'invalid date value';
        }

        OwnerId: string;
        Owner: User;
    }

    export class User extends PolluxEntity<string>{

        UserId: string;
        Stataus: number;
        Guid: string;
    }

    export class UserData extends PolluxEntity<number>{

        StringData: string;
        BinaryData: string;
        Name: string;

        OwnerId: string;
        Owner: User;
    }

    export class CredentialMetadata {

        constructor(public Name: string, public Access: Access) {
        }
    }

    export class Credential extends PolluxEntity<number>{

        Metadata: CredentialMetadata;
        Value: string;
        SecuredHash: string;
        ExpiresIn: string;
        Tags: string;

        OwnerId: string;
        Owner: User;
    }
}