var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Gaia;
(function (Gaia) {
    var Domain;
    (function (Domain) {
        var AdvertStatus;
        (function (AdvertStatus) {
            AdvertStatus[AdvertStatus["Draft"] = 0] = "Draft";
            AdvertStatus[AdvertStatus["Review"] = 1] = "Review";
            AdvertStatus[AdvertStatus["Published"] = 2] = "Published";
            AdvertStatus[AdvertStatus["Archived"] = 3] = "Archived";
            AdvertStatus[AdvertStatus["Suspended"] = 4] = "Suspended";
        })(AdvertStatus = Domain.AdvertStatus || (Domain.AdvertStatus = {}));
        var AdvertMediaType;
        (function (AdvertMediaType) {
            AdvertMediaType[AdvertMediaType["Video"] = 0] = "Video";
            AdvertMediaType[AdvertMediaType["Image"] = 1] = "Image";
        })(AdvertMediaType = Domain.AdvertMediaType || (Domain.AdvertMediaType = {}));
        var AccessPermission;
        (function (AccessPermission) {
            AccessPermission[AccessPermission["Grant"] = 0] = "Grant";
            AccessPermission[AccessPermission["Deny"] = 1] = "Deny";
        })(AccessPermission = Domain.AccessPermission || (Domain.AccessPermission = {}));
        var FeatureAccessProfileStatus;
        (function (FeatureAccessProfileStatus) {
            FeatureAccessProfileStatus[FeatureAccessProfileStatus["Active"] = 0] = "Active";
            FeatureAccessProfileStatus[FeatureAccessProfileStatus["Archived"] = 1] = "Archived";
        })(FeatureAccessProfileStatus = Domain.FeatureAccessProfileStatus || (Domain.FeatureAccessProfileStatus = {}));
        var ForumThreadStatus;
        (function (ForumThreadStatus) {
            ForumThreadStatus[ForumThreadStatus["Open"] = 0] = "Open";
            ForumThreadStatus[ForumThreadStatus["Closed"] = 1] = "Closed";
            ForumThreadStatus[ForumThreadStatus["Flagged"] = 2] = "Flagged";
        })(ForumThreadStatus = Domain.ForumThreadStatus || (Domain.ForumThreadStatus = {}));
        var ForumTopicStatus;
        (function (ForumTopicStatus) {
            ForumTopicStatus[ForumTopicStatus["Open"] = 0] = "Open";
            ForumTopicStatus[ForumTopicStatus["Closed"] = 1] = "Closed";
            ForumTopicStatus[ForumTopicStatus["Flagged"] = 2] = "Flagged";
        })(ForumTopicStatus = Domain.ForumTopicStatus || (Domain.ForumTopicStatus = {}));
        var NotificationStatus;
        (function (NotificationStatus) {
            NotificationStatus[NotificationStatus["Seen"] = 0] = "Seen";
            NotificationStatus[NotificationStatus["Unseen"] = 1] = "Unseen";
        })(NotificationStatus = Domain.NotificationStatus || (Domain.NotificationStatus = {}));
        var PostStatus;
        (function (PostStatus) {
            PostStatus[PostStatus["Private"] = 0] = "Private";
            PostStatus[PostStatus["Published"] = 1] = "Published";
            PostStatus[PostStatus["Archived"] = 2] = "Archived";
        })(PostStatus = Domain.PostStatus || (Domain.PostStatus = {}));
        var CommonDataType;
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
        })(CommonDataType = Domain.CommonDataType || (Domain.CommonDataType = {}));
        var FarmType;
        (function (FarmType) {
            FarmType[FarmType["Other"] = 0] = "Other";
            FarmType[FarmType["Crop"] = 1] = "Crop";
            FarmType[FarmType["Livestock"] = 2] = "Livestock";
            FarmType[FarmType["Mixed"] = 3] = "Mixed";
        })(FarmType = Domain.FarmType || (Domain.FarmType = {}));
        var ItemType;
        (function (ItemType) {
            ItemType[ItemType["Product"] = 0] = "Product";
            ItemType[ItemType["Service"] = 1] = "Service";
        })(ItemType = Domain.ItemType || (Domain.ItemType = {}));
        var ServiceStatus;
        (function (ServiceStatus) {
            ServiceStatus[ServiceStatus["Unavailable"] = 0] = "Unavailable";
            ServiceStatus[ServiceStatus["Available"] = 1] = "Available";
            ServiceStatus[ServiceStatus["Suspended"] = 2] = "Suspended";
        })(ServiceStatus = Domain.ServiceStatus || (Domain.ServiceStatus = {}));
        var ProductStatus;
        (function (ProductStatus) {
            ProductStatus[ProductStatus["Reviewing"] = 0] = "Reviewing";
            ProductStatus[ProductStatus["Published"] = 1] = "Published";
        })(ProductStatus = Domain.ProductStatus || (Domain.ProductStatus = {}));
        var OrderStatus;
        (function (OrderStatus) {
            /// <summary>
            /// A brand-new order will always be in this state. This is the only point (for now) where an order may be cancelled
            /// </summary>
            OrderStatus[OrderStatus["Staged"] = 0] = "Staged";
            /// <summary> as the payment is still being processed by the payment services
            /// </summary>
            OrderStatus[OrderStatus["ProcessingPayment"] = 1] = "ProcessingPayment";
            /// <summary>
            /// Soon after payment is confirmed, the service provider is notified that a new order has been placed by a customer.
            /// At this point, the system is awaiting acknowledgment from the service provider. Acknowledging the order begins
            /// the order-processing phase of the transaction
            /// </summary>
            OrderStatus[OrderStatus["AwaitingAcknowledgment"] = 2] = "AwaitingAcknowledgment";
            /// <summary>
            /// All of the intermediate processes that happens at the service provider's end will be represented by this state.
            /// "Acknowledging" an order automatically brings the order to this state.
            /// </summary>
            OrderStatus[OrderStatus["ServicingOrder"] = 3] = "ServicingOrder";
            /// <summary>
            /// Once the order has been concluded, e.g, product picked up, or shipment delivered, etc, the service provider
            /// changes the status of the order to fulfilled.
            /// </summary>
            OrderStatus[OrderStatus["OrderFulfilled"] = 4] = "OrderFulfilled";
            /// <summary>
            /// A customer may cancel a "staged" transaction. No other action will be taken on the order.
            /// </summary>
            OrderStatus[OrderStatus["OrderCancelled"] = 5] = "OrderCancelled";
            /// <summary>
            /// If some irrecoverable error happens during the life time of the order, before it is fulfilled, it is aborted.
            /// </summary>
            OrderStatus[OrderStatus["OrderAborted"] = 6] = "OrderAborted";
        })(OrderStatus = Domain.OrderStatus || (Domain.OrderStatus = {}));
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
        var Farm = (function (_super) {
            __extends(Farm, _super);
            function Farm(data) {
                var _this = _super.call(this, data) || this;
                _this.BusinessAccounts = [];
                //set default values
                if (Object.isNullOrUndefined(_this.FarmType))
                    _this.FarmType = null;
                if (Object.isNullOrUndefined(_this.BusinessAccounts))
                    _this.BusinessAccounts = [];
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            //ContextData: ContextData[] = [];
            Farm.prototype.GeoArea = function () {
                return Gaia.Utils.GeoArea.Parse(this.GeoData);
            };
            return Farm;
        }(GaiaEntity));
        Domain.Farm = Farm;
        var FeatureURI = (function (_super) {
            __extends(FeatureURI, _super);
            function FeatureURI(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                }
                return _this;
            }
            return FeatureURI;
        }(GaiaEntity));
        Domain.FeatureURI = FeatureURI;
        var ProductCategory = (function (_super) {
            __extends(ProductCategory, _super);
            function ProductCategory(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                }
                return _this;
            }
            return ProductCategory;
        }(GaiaEntity));
        Domain.ProductCategory = ProductCategory;
        var ServiceCategory = (function (_super) {
            __extends(ServiceCategory, _super);
            function ServiceCategory(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                }
                return _this;
            }
            return ServiceCategory;
        }(GaiaEntity));
        Domain.ServiceCategory = ServiceCategory;
        var Advert = (function (_super) {
            __extends(Advert, _super);
            function Advert(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
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
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return AdvertHit;
        }(GaiaEntity));
        Domain.AdvertHit = AdvertHit;
        var Comment = (function (_super) {
            __extends(Comment, _super);
            function Comment(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return Comment;
        }(GaiaEntity));
        Domain.Comment = Comment;
        var ContextVerification = (function (_super) {
            __extends(ContextVerification, _super);
            function ContextVerification(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    _this.User = data['User'] ? new Axis.Pollux.Domain.User(data['User']) : null;
                }
                return _this;
            }
            Object.defineProperty(ContextVerification.prototype, "IsExpired", {
                get: function () { return Date.now() > this.ExpiresOn.toMoment().toDate().valueOf(); },
                enumerable: true,
                configurable: true
            });
            return ContextVerification;
        }(GaiaEntity));
        Domain.ContextVerification = ContextVerification;
        var FeatureAccessDescriptor = (function (_super) {
            __extends(FeatureAccessDescriptor, _super);
            function FeatureAccessDescriptor(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                }
                return _this;
            }
            return FeatureAccessDescriptor;
        }(GaiaEntity));
        Domain.FeatureAccessDescriptor = FeatureAccessDescriptor;
        var FeatureAccessProfile = (function (_super) {
            __extends(FeatureAccessProfile, _super);
            function FeatureAccessProfile(data) {
                var _this = _super.call(this, data) || this;
                _this.AccessDescriptors = [];
                if (data) {
                    _this.AccessDescriptors = (data['AccessDescriptors'] || []).map(function (v) {
                        return new FeatureAccessDescriptor(v);
                    });
                }
                _this.AccessCode = _this.AccessCode || Gaia.Utils.NewGuid();
                return _this;
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
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.PinnedOn = data['PinnedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['PinnedOn']) : null;
                }
                return _this;
            }
            return PinnedFeedEntry;
        }(FeedEntry));
        Domain.PinnedFeedEntry = PinnedFeedEntry;
        var ForumThread = (function (_super) {
            __extends(ForumThread, _super);
            function ForumThread(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return ForumThread;
        }(GaiaEntity));
        Domain.ForumThread = ForumThread;
        var ForumThreadWatch = (function (_super) {
            __extends(ForumThreadWatch, _super);
            function ForumThreadWatch(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return ForumThreadWatch;
        }(GaiaEntity));
        Domain.ForumThreadWatch = ForumThreadWatch;
        var ForumTopic = (function (_super) {
            __extends(ForumTopic, _super);
            function ForumTopic(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                }
                return _this;
            }
            return ForumTopic;
        }(GaiaEntity));
        Domain.ForumTopic = ForumTopic;
        var Notification = (function (_super) {
            __extends(Notification, _super);
            function Notification(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.TargetUser = data['TargetUser'] ? new Axis.Pollux.Domain.User(data['TargetUser']) : null;
                }
                return _this;
            }
            return Notification;
        }(GaiaEntity));
        Domain.Notification = Notification;
        var PinnedFeed = (function (_super) {
            __extends(PinnedFeed, _super);
            function PinnedFeed(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return PinnedFeed;
        }(GaiaEntity));
        Domain.PinnedFeed = PinnedFeed;
        var Post = (function (_super) {
            __extends(Post, _super);
            function Post(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return Post;
        }(GaiaEntity));
        Domain.Post = Post;
        var Rating = (function (_super) {
            __extends(Rating, _super);
            function Rating(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return Rating;
        }(GaiaEntity));
        Domain.Rating = Rating;
        var SystemSetting = (function (_super) {
            __extends(SystemSetting, _super);
            function SystemSetting(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                }
                return _this;
            }
            return SystemSetting;
        }(GaiaEntity));
        Domain.SystemSetting = SystemSetting;
        var UserAccessProfile = (function (_super) {
            __extends(UserAccessProfile, _super);
            function UserAccessProfile(data) {
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.ExpiresOn = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
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
                var _this = _super.call(this, data) || this;
                if (data) {
                    _this.Owner = data['Owner'] ? new Axis.Pollux.Domain.User(data['Owner']) : null;
                }
                return _this;
            }
            return UserReaction;
        }(GaiaEntity));
        Domain.UserReaction = UserReaction;
        var OrderAggregate = (function (_super) {
            __extends(OrderAggregate, _super);
            function OrderAggregate(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(data)) {
                    _this.TimeStamp = data['ExpiresOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ExpiresOn']) : null;
                    var _orders = (data['Orders'] || []).map(function (r) { return new Order(r); });
                    (_a = _this.Orders).push.apply(_a, _orders);
                }
                return _this;
                var _a;
            }
            return OrderAggregate;
        }(GaiaEntity));
        Domain.OrderAggregate = OrderAggregate;
        var Order = (function (_super) {
            __extends(Order, _super);
            function Order(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(data)) {
                    _this.Service = !Object.isNullOrUndefined(data['Service']) ? new Service(data['Service']) : null;
                    _this.TimeStamp = !Object.isNullOrUndefined(data['TimeStamp']) ? new Axis.Apollo.Domain.JsonDateTime(data['TimeStamp']) : null;
                    _this.MessageTimeStamp = !Object.isNullOrUndefined(data['MessageTimeStamp']) ? new Axis.Apollo.Domain.JsonDateTime(data['MessageTimeStamp']) : null;
                    _this.Customer = !Object.isNullOrUndefined(data['Customer']) ? new Axis.Pollux.Domain.User(data['Customer']) : null;
                    _this.Merchant = !Object.isNullOrUndefined(data['Merchant']) ? new Axis.Pollux.Domain.User(data['Merchant']) : null;
                    _this.Previous = !Object.isNullOrUndefined(data['Previous']) ? new Order(data['Previous']) : null;
                    _this.Next = !Object.isNullOrUndefined(data['Next']) ? new Order(data['Next']) : null;
                }
                return _this;
            }
            return Order;
        }(GaiaEntity));
        Domain.Order = Order;
        var Service = (function (_super) {
            __extends(Service, _super);
            function Service(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(data)) {
                    _this.Product = !Object.isNullOrUndefined(_this.Product) ? new Product(_this.Product) : null;
                    _this.Inputs = !Object.isNullOrUndefined(_this.Inputs) ? _this.Inputs.map(function (r) { return new ServiceInterface(r); }) : [];
                    _this.Outputs = !Object.isNullOrUndefined(_this.Outputs) ? _this.Outputs.map(function (r) { return new ServiceInterface(r); }) : [];
                    _this.Images = !Object.isNullOrUndefined(_this.Images) ? _this.Images.map(function (r) { return new BlobRef(r); }) : [];
                }
                if (Object.isNullOrUndefined(_this.Status))
                    _this.Status = ServiceStatus.Unavailable;
                if (Object.isNullOrUndefined(_this.Cost))
                    _this.Cost = 0.0;
                return _this;
            }
            Object.defineProperty(Service.prototype, "ItemType", {
                get: function () { return ItemType.Service; },
                enumerable: true,
                configurable: true
            });
            return Service;
        }(GaiaEntity));
        Domain.Service = Service;
        var Product = (function (_super) {
            __extends(Product, _super);
            function Product(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(_this.Images)) {
                    _this.Images = !Object.isNullOrUndefined(_this.Images) ? _this.Images.map(function (r) { return new BlobRef(r); }) : [];
                }
                else
                    _this.Images = [];
                if (Object.isNullOrUndefined(_this.Status))
                    _this.Status = ProductStatus.Reviewing;
                if (Object.isNullOrUndefined(_this.Cost))
                    _this.Cost = 0.0;
                return _this;
            }
            Object.defineProperty(Product.prototype, "ItemType", {
                get: function () { return ItemType.Product; },
                enumerable: true,
                configurable: true
            });
            return Product;
        }(GaiaEntity));
        Domain.Product = Product;
        var ServiceInterface = (function (_super) {
            __extends(ServiceInterface, _super);
            function ServiceInterface(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(data)) {
                    _this.Datacontract = !Object.isNullOrUndefined(_this.Datacontract) ? new ServiceDataContract(_this.Datacontract) : null;
                }
                return _this;
            }
            return ServiceInterface;
        }(GaiaEntity));
        Domain.ServiceInterface = ServiceInterface;
        var ServiceDataContract = (function (_super) {
            __extends(ServiceDataContract, _super);
            function ServiceDataContract(data) {
                return _super.call(this, data) || this;
            }
            return ServiceDataContract;
        }(GaiaEntity));
        Domain.ServiceDataContract = ServiceDataContract;
        var ShoppingCartItem = (function (_super) {
            __extends(ShoppingCartItem, _super);
            function ShoppingCartItem(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(data)) {
                    _this.Owner = !Object.isNullOrUndefined(_this.Owner) ? new Axis.Pollux.Domain.User(data) : null;
                }
                return _this;
            }
            return ShoppingCartItem;
        }(GaiaEntity));
        Domain.ShoppingCartItem = ShoppingCartItem;
        var ShoppingListItem = (function (_super) {
            __extends(ShoppingListItem, _super);
            function ShoppingListItem(data) {
                var _this = _super.call(this, data) || this;
                if (!Object.isNullOrUndefined(data)) {
                    _this.Owner = !Object.isNullOrUndefined(_this.Owner) ? new Axis.Pollux.Domain.User(data) : null;
                }
                return _this;
            }
            return ShoppingListItem;
        }(GaiaEntity));
        Domain.ShoppingListItem = ShoppingListItem;
        var BlobRef = (function () {
            function BlobRef(data) {
                this.Uri = null;
                this.Metadata = null;
                if (!Object.isNullOrUndefined(data))
                    data.copyTo(this);
            }
            BlobRef.prototype.MetadataTags = function () {
                if (!Object.isNullOrUndefined(this.Metadata))
                    return Gaia.Utils.StringPair.ParseStringPairs(this.Metadata);
                else
                    return [];
            };
            return BlobRef;
        }());
        Domain.BlobRef = BlobRef;
    })(Domain = Gaia.Domain || (Gaia.Domain = {}));
})(Gaia || (Gaia = {}));
