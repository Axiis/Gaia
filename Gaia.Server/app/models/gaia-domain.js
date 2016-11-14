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
        (function (FarmType) {
            FarmType[FarmType["Other"] = 0] = "Other";
            FarmType[FarmType["Crop"] = 1] = "Crop";
            FarmType[FarmType["Livestock"] = 2] = "Livestock";
            FarmType[FarmType["Mixed"] = 3] = "Mixed";
        })(Domain.FarmType || (Domain.FarmType = {}));
        var FarmType = Domain.FarmType;
        (function (ServiceType) {
            ServiceType[ServiceType["Other"] = 0] = "Other";
        })(Domain.ServiceType || (Domain.ServiceType = {}));
        var ServiceType = Domain.ServiceType;
        var GaiaEntity = (function () {
            function GaiaEntity(data) {
                if (data) {
                    data.copyTo(this);
                    this.CreatedOn = data['CreatedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['CreatedOn']) : null;
                    this.ModifiedOn = data['ModifiedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ModifiedOn']) : null;
                }
            }
            return GaiaEntity;
        }());
        Domain.GaiaEntity = GaiaEntity;
        var FarmAccount = (function (_super) {
            __extends(FarmAccount, _super);
            function FarmAccount(data) {
                _super.call(this, data);
                this.BusinessAccounts = [];
                //set default values
                if (Object.isNullOrUndefined(this.FarmType))
                    this.FarmType = null;
                if (Object.isNullOrUndefined(this.BusinessAccounts))
                    this.BusinessAccounts = [];
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            //ContextData: ContextData[] = [];
            FarmAccount.prototype.GeoArea = function () {
                return Gaia.Utils.GeoArea.Parse(this.GeoData);
            };
            return FarmAccount;
        }(GaiaEntity));
        Domain.FarmAccount = FarmAccount;
        var ServiceAccount = (function (_super) {
            __extends(ServiceAccount, _super);
            //ContextData: ContextData[];
            function ServiceAccount(data) {
                _super.call(this, data);
                if (Object.isNullOrUndefined(this.ServiceType))
                    this.ServiceType = null;
                if (Object.isNullOrUndefined(this.BusinessAccounts))
                    this.BusinessAccounts = [];
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                    this.BusinessAccounts = (data['BusinessAccounts'] || [])
                        .map(function (v) { return new Axis.Pollux.Domain.CorporateData(v); });
                }
            }
            return ServiceAccount;
        }(GaiaEntity));
        Domain.ServiceAccount = ServiceAccount;
        var FeatureURI = (function (_super) {
            __extends(FeatureURI, _super);
            function FeatureURI(data) {
                _super.call(this, data);
                if (data) {
                }
            }
            return FeatureURI;
        }(GaiaEntity));
        Domain.FeatureURI = FeatureURI;
        var ProductCategory = (function (_super) {
            __extends(ProductCategory, _super);
            function ProductCategory(data) {
                _super.call(this, data);
                if (data) {
                }
            }
            return ProductCategory;
        }(GaiaEntity));
        Domain.ProductCategory = ProductCategory;
        var ServiceCategory = (function (_super) {
            __extends(ServiceCategory, _super);
            function ServiceCategory(data) {
                _super.call(this, data);
                if (data) {
                }
            }
            return ServiceCategory;
        }(GaiaEntity));
        Domain.ServiceCategory = ServiceCategory;
        var Advert = (function (_super) {
            __extends(Advert, _super);
            function Advert(data) {
                _super.call(this, data);
                if (data) {
                    this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            Object.defineProperty(Advert.prototype, "IsExpired", {
                get: function () { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); },
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
            function AdvertHit(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return AdvertHit;
        }(GaiaEntity));
        Domain.AdvertHit = AdvertHit;
        var Comment = (function (_super) {
            __extends(Comment, _super);
            function Comment(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return Comment;
        }(GaiaEntity));
        Domain.Comment = Comment;
        var ContextVerification = (function (_super) {
            __extends(ContextVerification, _super);
            function ContextVerification(data) {
                _super.call(this, data);
                if (data) {
                    this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    this.User = data['User'] ? new Axis.Pollux.Domain.User(data['User']) : null;
                }
            }
            Object.defineProperty(ContextVerification.prototype, "IsExpired", {
                get: function () { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); },
                enumerable: true,
                configurable: true
            });
            return ContextVerification;
        }(GaiaEntity));
        Domain.ContextVerification = ContextVerification;
        var FarmInfo = (function (_super) {
            __extends(FarmInfo, _super);
            function FarmInfo(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return FarmInfo;
        }(GaiaEntity));
        Domain.FarmInfo = FarmInfo;
        var FeatureAccessDescriptor = (function (_super) {
            __extends(FeatureAccessDescriptor, _super);
            function FeatureAccessDescriptor(data) {
                _super.call(this, data);
                if (data) {
                }
            }
            return FeatureAccessDescriptor;
        }(GaiaEntity));
        Domain.FeatureAccessDescriptor = FeatureAccessDescriptor;
        var FeatureAccessProfile = (function (_super) {
            __extends(FeatureAccessProfile, _super);
            function FeatureAccessProfile(data) {
                _super.call(this, data);
                this.AccessDescriptors = [];
                if (data) {
                    this.AccessDescriptors = (data['AccessDescriptors'] || []).map(function (v) {
                        return new FeatureAccessDescriptor(v);
                    });
                }
                this.AccessCode = this.AccessCode || Gaia.Utils.NewGuid();
            }
            return FeatureAccessProfile;
        }(GaiaEntity));
        Domain.FeatureAccessProfile = FeatureAccessProfile;
        var FeedEntry = (function () {
            function FeedEntry(data) {
                if (data) {
                    this.CreatedOn = data['CreatedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['CreatedOn']) : null;
                    this.ModifiedOn = data['ModifiedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ModifiedOn']) : null;
                }
            }
            return FeedEntry;
        }());
        Domain.FeedEntry = FeedEntry;
        var PinnedFeedEntry = (function (_super) {
            __extends(PinnedFeedEntry, _super);
            function PinnedFeedEntry(data) {
                _super.call(this, data);
                if (data) {
                    this.PinnedOn = data['PinnedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['PinnedOn']) : null;
                }
            }
            return PinnedFeedEntry;
        }(FeedEntry));
        Domain.PinnedFeedEntry = PinnedFeedEntry;
        var ForumThread = (function (_super) {
            __extends(ForumThread, _super);
            function ForumThread(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return ForumThread;
        }(GaiaEntity));
        Domain.ForumThread = ForumThread;
        var ForumThreadWatch = (function (_super) {
            __extends(ForumThreadWatch, _super);
            function ForumThreadWatch(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return ForumThreadWatch;
        }(GaiaEntity));
        Domain.ForumThreadWatch = ForumThreadWatch;
        var ForumTopic = (function (_super) {
            __extends(ForumTopic, _super);
            function ForumTopic(data) {
                _super.call(this, data);
                if (data) {
                }
            }
            return ForumTopic;
        }(GaiaEntity));
        Domain.ForumTopic = ForumTopic;
        var Notification = (function (_super) {
            __extends(Notification, _super);
            function Notification(data) {
                _super.call(this, data);
                if (data) {
                    this.TargetUser = data['TargetUser'] ? new Axis.Pollux.Domain.User(data['TargetUser']) : null;
                }
            }
            return Notification;
        }(GaiaEntity));
        Domain.Notification = Notification;
        var PinnedFeed = (function (_super) {
            __extends(PinnedFeed, _super);
            function PinnedFeed(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return PinnedFeed;
        }(GaiaEntity));
        Domain.PinnedFeed = PinnedFeed;
        var Post = (function (_super) {
            __extends(Post, _super);
            function Post(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return Post;
        }(GaiaEntity));
        Domain.Post = Post;
        var Rating = (function (_super) {
            __extends(Rating, _super);
            function Rating(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return Rating;
        }(GaiaEntity));
        Domain.Rating = Rating;
        var ServiceInfo = (function (_super) {
            __extends(ServiceInfo, _super);
            function ServiceInfo(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                    this.Category = data['Category'] ? new Gaia.Domain.ServiceCategory(data['Category']) : null;
                }
            }
            return ServiceInfo;
        }(GaiaEntity));
        Domain.ServiceInfo = ServiceInfo;
        var SystemSetting = (function (_super) {
            __extends(SystemSetting, _super);
            function SystemSetting(data) {
                _super.call(this, data);
                if (data) {
                }
            }
            return SystemSetting;
        }(GaiaEntity));
        Domain.SystemSetting = SystemSetting;
        var UserAccessProfile = (function (_super) {
            __extends(UserAccessProfile, _super);
            function UserAccessProfile(data) {
                _super.call(this, data);
                if (data) {
                    this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            Object.defineProperty(UserAccessProfile.prototype, "IsExpired", {
                get: function () { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); },
                enumerable: true,
                configurable: true
            });
            return UserAccessProfile;
        }(GaiaEntity));
        Domain.UserAccessProfile = UserAccessProfile;
        var UserReaction = (function (_super) {
            __extends(UserReaction, _super);
            function UserReaction(data) {
                _super.call(this, data);
                if (data) {
                    this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
            }
            return UserReaction;
        }(GaiaEntity));
        Domain.UserReaction = UserReaction;
    })(Domain = Gaia.Domain || (Gaia.Domain = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=gaia-domain.js.map