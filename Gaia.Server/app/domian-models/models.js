var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Gaia;
(function (Gaia) {
    var Domain;
    (function (Domain) {
        (function (AdvertStatus) {
            AdvertStatus[AdvertStatus["Draft"] = 0] = "Draft";
            AdvertStatus[AdvertStatus["Review"] = 1] = "Review";
            AdvertStatus[AdvertStatus["Published"] = 2] = "Published";
            AdvertStatus[AdvertStatus["Archived"] = 3] = "Archived";
            AdvertStatus[AdvertStatus["Suspended"] = 4] = "Suspended";
        })(Domain.AdvertStatus || (Domain.AdvertStatus = {}));
        var AdvertStatus = Domain.AdvertStatus;
        (function (AdvertMediaType) {
            AdvertMediaType[AdvertMediaType["Video"] = 0] = "Video";
            AdvertMediaType[AdvertMediaType["Image"] = 1] = "Image";
        })(Domain.AdvertMediaType || (Domain.AdvertMediaType = {}));
        var AdvertMediaType = Domain.AdvertMediaType;
        (function (AccessPermission) {
            AccessPermission[AccessPermission["Grant"] = 0] = "Grant";
            AccessPermission[AccessPermission["Deny"] = 1] = "Deny";
        })(Domain.AccessPermission || (Domain.AccessPermission = {}));
        var AccessPermission = Domain.AccessPermission;
        (function (FeatureAccessProfileStatus) {
            FeatureAccessProfileStatus[FeatureAccessProfileStatus["Active"] = 0] = "Active";
            FeatureAccessProfileStatus[FeatureAccessProfileStatus["Archived"] = 1] = "Archived";
        })(Domain.FeatureAccessProfileStatus || (Domain.FeatureAccessProfileStatus = {}));
        var FeatureAccessProfileStatus = Domain.FeatureAccessProfileStatus;
        (function (ForumThreadStatus) {
            ForumThreadStatus[ForumThreadStatus["Open"] = 0] = "Open";
            ForumThreadStatus[ForumThreadStatus["Closed"] = 1] = "Closed";
            ForumThreadStatus[ForumThreadStatus["Flagged"] = 2] = "Flagged";
        })(Domain.ForumThreadStatus || (Domain.ForumThreadStatus = {}));
        var ForumThreadStatus = Domain.ForumThreadStatus;
        (function (ForumTopicStatus) {
            ForumTopicStatus[ForumTopicStatus["Open"] = 0] = "Open";
            ForumTopicStatus[ForumTopicStatus["Closed"] = 1] = "Closed";
            ForumTopicStatus[ForumTopicStatus["Flagged"] = 2] = "Flagged";
        })(Domain.ForumTopicStatus || (Domain.ForumTopicStatus = {}));
        var ForumTopicStatus = Domain.ForumTopicStatus;
        (function (NotificationStatus) {
            NotificationStatus[NotificationStatus["Seen"] = 0] = "Seen";
            NotificationStatus[NotificationStatus["Unseen"] = 1] = "Unseen";
        })(Domain.NotificationStatus || (Domain.NotificationStatus = {}));
        var NotificationStatus = Domain.NotificationStatus;
        (function (PostStatus) {
            PostStatus[PostStatus["Private"] = 0] = "Private";
            PostStatus[PostStatus["Published"] = 1] = "Published";
            PostStatus[PostStatus["Archived"] = 2] = "Archived";
        })(Domain.PostStatus || (Domain.PostStatus = {}));
        var PostStatus = Domain.PostStatus;
        (function (CommonDataType) {
            CommonDataType[CommonDataType["String"] = 0] = "String";
            CommonDataType[CommonDataType["Intereger"] = 1] = "Intereger";
            CommonDataType[CommonDataType["Float"] = 2] = "Float";
            CommonDataType[CommonDataType["Boolean"] = 3] = "Boolean";
            CommonDataType[CommonDataType["Binary"] = 4] = "Binary";
            CommonDataType[CommonDataType["DateTime"] = 5] = "DateTime";
            CommonDataType[CommonDataType["TimeSpan"] = 6] = "TimeSpan";
            CommonDataType[CommonDataType["Url"] = 7] = "Url";
            CommonDataType[CommonDataType["Object"] = 8] = "Object";
        })(Domain.CommonDataType || (Domain.CommonDataType = {}));
        var CommonDataType = Domain.CommonDataType;
        (function (Gender) {
            Gender[Gender["Female"] = 0] = "Female";
            Gender[Gender["Male"] = 1] = "Male";
            Gender[Gender["Other"] = 2] = "Other";
        })(Domain.Gender || (Domain.Gender = {}));
        var Gender = Domain.Gender;
        (function (Access) {
            Access[Access["Public"] = 0] = "Public";
            Access[Access["Secret"] = 1] = "Secret";
        })(Domain.Access || (Domain.Access = {}));
        var Access = Domain.Access;
        var GaiaEntity = (function () {
            function GaiaEntity() {
            }
            Object.defineProperty(GaiaEntity.prototype, "CreatedOn", {
                get: function () {
                    return this._createdOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._createdOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._createdOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GaiaEntity.prototype, "ModifiedOn", {
                get: function () {
                    return this._modifiedOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._modifiedOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._modifiedOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return GaiaEntity;
        }());
        Domain.GaiaEntity = GaiaEntity;
        var FeatureURI = (function (_super) {
            __extends(FeatureURI, _super);
            function FeatureURI() {
                _super.apply(this, arguments);
            }
            return FeatureURI;
        }(GaiaEntity));
        Domain.FeatureURI = FeatureURI;
        var ProductCategory = (function (_super) {
            __extends(ProductCategory, _super);
            function ProductCategory() {
                _super.apply(this, arguments);
            }
            return ProductCategory;
        }(GaiaEntity));
        Domain.ProductCategory = ProductCategory;
        var ServiceCategory = (function (_super) {
            __extends(ServiceCategory, _super);
            function ServiceCategory() {
                _super.apply(this, arguments);
            }
            return ServiceCategory;
        }(GaiaEntity));
        Domain.ServiceCategory = ServiceCategory;
        var Advert = (function (_super) {
            __extends(Advert, _super);
            function Advert() {
                _super.call(this);
                this.Status = AdvertStatus.Draft;
            }
            Object.defineProperty(Advert.prototype, "ExpiresOn", {
                get: function () {
                    return this._expiresOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._expiresOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._expiresOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Advert.prototype, "IsExpired", {
                get: function () { return Date.now() > this.ExpiresOn.valueOf(); },
                enumerable: true,
                configurable: true
            });
            Advert.prototype.Services = function () {
                return (this.ServiceTags || '')
                    .split(',')
                    .project(function (v) { return Lazy(v); })
                    .map(function (_item) { return _item.trimLeft('[').trimRight(']').trim(); })
                    .toArray();
            };
            return Advert;
        }(GaiaEntity));
        Domain.Advert = Advert;
        var AdvertHit = (function (_super) {
            __extends(AdvertHit, _super);
            function AdvertHit() {
                _super.apply(this, arguments);
            }
            return AdvertHit;
        }(GaiaEntity));
        Domain.AdvertHit = AdvertHit;
        var Comment = (function (_super) {
            __extends(Comment, _super);
            function Comment() {
                _super.apply(this, arguments);
            }
            return Comment;
        }(GaiaEntity));
        Domain.Comment = Comment;
        var ContextVerification = (function (_super) {
            __extends(ContextVerification, _super);
            function ContextVerification() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(ContextVerification.prototype, "ExpiresOn", {
                get: function () {
                    return this._expiresOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._expiresOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._expiresOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return ContextVerification;
        }(GaiaEntity));
        Domain.ContextVerification = ContextVerification;
        var FarmInfo = (function (_super) {
            __extends(FarmInfo, _super);
            function FarmInfo() {
                _super.apply(this, arguments);
            }
            return FarmInfo;
        }(GaiaEntity));
        Domain.FarmInfo = FarmInfo;
        var FeatureAccessDescriptor = (function (_super) {
            __extends(FeatureAccessDescriptor, _super);
            function FeatureAccessDescriptor() {
                _super.apply(this, arguments);
            }
            return FeatureAccessDescriptor;
        }(GaiaEntity));
        Domain.FeatureAccessDescriptor = FeatureAccessDescriptor;
        var FeatureAccessProfile = (function (_super) {
            __extends(FeatureAccessProfile, _super);
            function FeatureAccessProfile() {
                _super.call(this);
                this.AccessDescriptors = [];
                this.AccessCode = Gaia.Utils.NewGuid();
            }
            return FeatureAccessProfile;
        }(GaiaEntity));
        Domain.FeatureAccessProfile = FeatureAccessProfile;
        var FeedEntry = (function () {
            function FeedEntry() {
            }
            Object.defineProperty(FeedEntry.prototype, "CreatedOn", {
                get: function () {
                    return this._createdOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._createdOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._createdOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FeedEntry.prototype, "ModifiedOn", {
                get: function () {
                    return this._modifiedOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._modifiedOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._modifiedOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return FeedEntry;
        }());
        Domain.FeedEntry = FeedEntry;
        var PinnedFeedEntry = (function (_super) {
            __extends(PinnedFeedEntry, _super);
            function PinnedFeedEntry() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(PinnedFeedEntry.prototype, "PinnedOn", {
                get: function () {
                    return this._pinnedOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._pinnedOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._pinnedOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return PinnedFeedEntry;
        }(FeedEntry));
        Domain.PinnedFeedEntry = PinnedFeedEntry;
        var ForumThread = (function (_super) {
            __extends(ForumThread, _super);
            function ForumThread() {
                _super.apply(this, arguments);
            }
            return ForumThread;
        }(GaiaEntity));
        Domain.ForumThread = ForumThread;
        var ForumThreadWatch = (function (_super) {
            __extends(ForumThreadWatch, _super);
            function ForumThreadWatch() {
                _super.apply(this, arguments);
            }
            return ForumThreadWatch;
        }(GaiaEntity));
        Domain.ForumThreadWatch = ForumThreadWatch;
        var ForumTopic = (function (_super) {
            __extends(ForumTopic, _super);
            function ForumTopic() {
                _super.apply(this, arguments);
            }
            return ForumTopic;
        }(GaiaEntity));
        Domain.ForumTopic = ForumTopic;
        var Notification = (function (_super) {
            __extends(Notification, _super);
            function Notification() {
                _super.apply(this, arguments);
            }
            return Notification;
        }(GaiaEntity));
        Domain.Notification = Notification;
        var PinnedFeed = (function (_super) {
            __extends(PinnedFeed, _super);
            function PinnedFeed() {
                _super.apply(this, arguments);
            }
            return PinnedFeed;
        }(GaiaEntity));
        Domain.PinnedFeed = PinnedFeed;
        var Post = (function (_super) {
            __extends(Post, _super);
            function Post() {
                _super.apply(this, arguments);
            }
            return Post;
        }(GaiaEntity));
        Domain.Post = Post;
        var Rating = (function (_super) {
            __extends(Rating, _super);
            function Rating() {
                _super.apply(this, arguments);
            }
            return Rating;
        }(GaiaEntity));
        Domain.Rating = Rating;
        var ServiceInfo = (function (_super) {
            __extends(ServiceInfo, _super);
            function ServiceInfo() {
                _super.apply(this, arguments);
            }
            return ServiceInfo;
        }(GaiaEntity));
        Domain.ServiceInfo = ServiceInfo;
        var SystemSetting = (function (_super) {
            __extends(SystemSetting, _super);
            function SystemSetting() {
                _super.apply(this, arguments);
            }
            return SystemSetting;
        }(GaiaEntity));
        Domain.SystemSetting = SystemSetting;
        var UserAccessProfile = (function (_super) {
            __extends(UserAccessProfile, _super);
            function UserAccessProfile() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(UserAccessProfile.prototype, "ExpiresOn", {
                get: function () {
                    return this._expiresOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._expiresOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._expiresOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return UserAccessProfile;
        }(GaiaEntity));
        Domain.UserAccessProfile = UserAccessProfile;
        var UserReaction = (function (_super) {
            __extends(UserReaction, _super);
            function UserReaction() {
                _super.apply(this, arguments);
            }
            return UserReaction;
        }(GaiaEntity));
        Domain.UserReaction = UserReaction;
        var PolluxEntity = (function () {
            function PolluxEntity() {
            }
            Object.defineProperty(PolluxEntity.prototype, "CreatedOn", {
                get: function () {
                    return this._createdOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._createdOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._createdOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PolluxEntity.prototype, "ModifiedOn", {
                get: function () {
                    return this._modifiedOn;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._modifiedOn = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._modifiedOn = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return PolluxEntity;
        }());
        Domain.PolluxEntity = PolluxEntity;
        var AddressData = (function (_super) {
            __extends(AddressData, _super);
            function AddressData() {
                _super.apply(this, arguments);
            }
            return AddressData;
        }(PolluxEntity));
        Domain.AddressData = AddressData;
        var BioData = (function (_super) {
            __extends(BioData, _super);
            function BioData() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(BioData.prototype, "Dob", {
                get: function () {
                    return this._dob;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._dob = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._dob = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return BioData;
        }(PolluxEntity));
        Domain.BioData = BioData;
        var ContactData = (function (_super) {
            __extends(ContactData, _super);
            function ContactData() {
                _super.apply(this, arguments);
            }
            return ContactData;
        }(PolluxEntity));
        Domain.ContactData = ContactData;
        var CorporateData = (function (_super) {
            __extends(CorporateData, _super);
            function CorporateData() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CorporateData.prototype, "IncorporationDate", {
                get: function () {
                    return this._incorporationDate;
                },
                set: function (value) {
                    if (value instanceof String)
                        this._incorporationDate = null; // <-- use a moment date to convert it
                    else if (value instanceof Date)
                        this._incorporationDate = value;
                    else
                        throw 'invalid date value';
                },
                enumerable: true,
                configurable: true
            });
            return CorporateData;
        }(PolluxEntity));
        Domain.CorporateData = CorporateData;
        var User = (function (_super) {
            __extends(User, _super);
            function User() {
                _super.apply(this, arguments);
            }
            return User;
        }(PolluxEntity));
        Domain.User = User;
        var UserData = (function (_super) {
            __extends(UserData, _super);
            function UserData() {
                _super.apply(this, arguments);
            }
            return UserData;
        }(PolluxEntity));
        Domain.UserData = UserData;
        var CredentialMetadata = (function () {
            function CredentialMetadata(Name, Access) {
                this.Name = Name;
                this.Access = Access;
            }
            return CredentialMetadata;
        }());
        Domain.CredentialMetadata = CredentialMetadata;
        var Credential = (function (_super) {
            __extends(Credential, _super);
            function Credential() {
                _super.apply(this, arguments);
            }
            return Credential;
        }(PolluxEntity));
        Domain.Credential = Credential;
    })(Domain = Gaia.Domain || (Gaia.Domain = {}));
})(Gaia || (Gaia = {}));
