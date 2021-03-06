﻿using Axis.Jupiter.Europa;
using Axis.Jupiter.Europa.Module;
using Axis.Luna.Extensions;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;
using Gaia.Core.Domain.Meta;
using Gaia.Core.OAModule.Mappings;
using Gaia.Core.OAModule.Mappings.Accounts;
using Gaia.Core.OAModule.Mappings.MarketPlace;
using Gaia.Core.OAModule.Mappings.Meta;
using Gaia.Core.Services;
using Gaia.Core.Utils;
using System;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Reflection;

namespace Gaia.Core.OAModule
{
    public class GaiaDomainModuleConfig : BaseModuleConfigProvider
    {
        public override string ModuleName => "Gaia.Core.ObjectAccessModule";

        protected override void Initialize()
        {
            //Configuration
            var asm = typeof(GaiaDomainModuleConfig).Assembly;
            var nsar = new string[]
            {
                typeof(AdvertMapping).Namespace,
                typeof(ServiceCategoryMapping).Namespace,
                typeof(FarmMapping).Namespace,
                typeof(OrderAggregateMap).Namespace
            };
            asm.GetTypes()
               .Where(t => nsar.Contains(t.Namespace))
               .Where(t => t.IsEntityMap())
               .ForAll((cnt, t) => this.UsingConfiguration(Activator.CreateInstance(t).AsDynamic()));

            //setup the comments view
            this.WithContextQueryGenerator("gaia.CommentHierarchy", (_cxt, args) =>
            {
                var context = _cxt.As<EuropaContext>();
                var commentTable = context.EFMappings.MappingFor<Comment>().MappedTable;
                var commentContext = typeof(Comment).GaiaDomainTypeName();

                var sql = @"
    WITH CommentRecursive ( CommentId, ParentId ) AS
    ( 
        SELECT   ct.EntityId , ct.ContextId, ct.EntityId as Root
        FROM     [dbo].[" + commentTable + @"] AS ct
        WHERE    ct.ContextId = " + args[0] + @"

        UNION ALL 
        SELECT     ct.CommentId , ct.ContextId, cr.Root
        FROM       CommentRecursive AS cr
        INNER JOIN [dbo].[" + commentTable + @"] AS ct 
        ON         ct.ContextId = cr.EntityId 
    )

    SELECT ct.* 
    FROM CommentRecursive as cr 
    JOIN " + commentTable + @" as ct
    ON   cr.EntityId = ct.EntityId
";

                return context.Database.SqlQuery<Comment>(sql).AsQueryable();
            });


            //seeding
            //1. Seed the application-feature-catalogue (a list of FeatureURI's). Note that 'savechanges' is automatically called.
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureURI>();
                if (!store.Query.Any(_f => _f.URI == "system/User/Advert/@create"))
                {
                    var ns = typeof(IAdvertService).Namespace;
                    asm.GetTypes()
                       .Where(t => t.Namespace == ns)
                       .Where(t => t.IsInterface)
                       .SelectMany(i => i.GetMethods())
                       .SelectMany(im => im.GetCustomAttributes<FeatureAttribute>())
                       .Where(fatt => fatt != null)
                       .ForAll((cnt, fatt) => store.Add(new FeatureURI { Name = fatt.Name, URI = fatt.URI }));
                }
            });

            //2. Seed the system with the default access-profiles

            #region 2.1 Root user/profile
            //the user object
            this.UsingContext(context =>
            {
                var store = context.Store<User>();
                if (!store.Query.Any(_u => _u.EntityId == DomainConstants.RootAccount))
                    store.Add(new User
                    {
                        UserId = DomainConstants.RootAccount,
                        Status = UserStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessCode == DomainConstants.DefaultSystemAdminAccessProfile))
                    store.Add(new FeatureAccessProfile
                    {
                        AccessCode = DomainConstants.DefaultSystemAdminAccessProfile,
                        Title = "Default Root Access Profile",
                        Description = "Defines access privileges for the Root user",
                        CreatedBy = DomainConstants.RootAccount,
                        Status = FeatureAccessProfileStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the default access descriptors
            this.UsingEntitySeed<FeatureAccessDescriptor>(store =>
            {
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.DefaultSystemAdminAccessProfile))
                    store.Add(new FeatureAccessDescriptor
                    {
                        AccessDescriptor = "system/*",
                        AccessProfileCode = DomainConstants.DefaultSystemAdminAccessProfile,
                        CreatedBy = DomainConstants.RootAccount,
                        Permission = AccessPermission.Grant
                    });
                store.Context.CommitChanges();
            });

            //assign the profile to the user
            this.UsingContext(context =>
            {
                var store = context.Store<UserAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.DefaultSystemAdminAccessProfile))
                    store.Add(new UserAccessProfile
                    {
                        CreatedBy = DomainConstants.RootAccount,
                        ExpiresOn = null, //<- meaning, never expire!
                        AccessProfileCode = DomainConstants.DefaultSystemAdminAccessProfile,
                        OwnerId = DomainConstants.RootAccount
                    })
                    .Context.CommitChanges();
            });
            #endregion

            #region 2.2 Guest user/profile
            //the user object
            this.UsingContext(context =>
            {
                var store = context.Store<User>();
                if (!store.Query.Any(_u => _u.EntityId == DomainConstants.GuestAccount))
                    context.Store<User>().Add(new User
                    {
                        UserId = DomainConstants.GuestAccount,
                        Status = UserStatus.Active
                    }).Context.CommitChanges();
            });

            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessCode == DomainConstants.GuestAccessProfile))
                    store.Add(new FeatureAccessProfile
                    {
                        AccessCode = DomainConstants.GuestAccessProfile,
                        Title = "Default Guest Access Profile",
                        Description = "Defines access privileges for the guest users",
                        CreatedBy = DomainConstants.RootAccount,
                        Status = FeatureAccessProfileStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the default access descriptors
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessDescriptor>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.GuestAccessProfile))
                {
                    new[]
                    {
                        "system/Profiles/@register",
                        "system/Profiles/@create-activation-verification",
                        "system/Profiles/@verify-activation-verification",
                        "system/Profiles/@create-registration-verification",
                        "system/Profiles/@verify-registration-verification",
                        "system/AccessProfiles/@apply",
                        "system/ContextVerifications/@create",
                        "system/ContextVerifications/@verify"
                    }
                    .ForAll((cnt, next) =>
                    {
                        store.Add(new FeatureAccessDescriptor
                        {
                            AccessDescriptor = next,
                            AccessProfileCode = DomainConstants.GuestAccessProfile,
                            CreatedBy = DomainConstants.RootAccount,
                            Permission = AccessPermission.Grant
                        });
                    });
                    store.Context.CommitChanges();
                }
            });

            //assign the profile to the user
            this.UsingContext(context =>
            {
                var store = context.Store<UserAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.GuestAccessProfile))
                    store.Add(new UserAccessProfile
                    {
                        CreatedBy = DomainConstants.RootAccount,
                        ExpiresOn = null, //<- meaning, never expire!
                        AccessProfileCode = DomainConstants.GuestAccessProfile,
                        OwnerId = DomainConstants.GuestAccount
                    })
                    .Context.CommitChanges();
            });
            #endregion

            #region 2.3 Policy-Admin profile
            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessCode == DomainConstants.DefaultPolicyAdminAccessProfile))
                    store.Add(new FeatureAccessProfile
                    {
                        AccessCode = DomainConstants.DefaultPolicyAdminAccessProfile,
                        Title = "Default Policy-Admin Access Profile",
                        Description = "Defines access privileges for the Policy-Admin user",
                        CreatedBy = DomainConstants.RootAccount,
                        Status = FeatureAccessProfileStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the default access descriptors
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessDescriptor>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.DefaultPolicyAdminAccessProfile))
                    new[] 
                    {
                        "system/User/Profile/@remove-data",
                        "system/User/Profile/@add-data",
                        "system/Profiles/@create-activation-verification",
                        "system/User/Profile/@verify-activation-verification",
                        "system/User/Profile/@verify-activation-verification",
                        "system/Profiles/UserData/@get",
                        "system/Profiles/BioData/@get",
                        "system/Profiles/ContactData/@get",
                        "system/Profiles/Corporate/@get",
                    
                        "system/User/AccessProfile/*",
                        "system/AccessProfiles/*",
                    
                        "system/Forums/Topic/*",
                    
                        "system/User/ContextVerification/*",
                    
                        "system/Notifications/*",
                        "system/User/Notification/*",
                    
                        "system/User/Post/*"
                    }
                    .ForAll((cnt, next) =>
                    {
                        store.Add(new FeatureAccessDescriptor
                        {
                            AccessDescriptor = next,
                            AccessProfileCode = DomainConstants.DefaultPolicyAdminAccessProfile,
                            CreatedBy = DomainConstants.RootAccount,
                            Permission = AccessPermission.Grant
                        });
                    });
                    store.Context.CommitChanges();
            });
            #endregion

            #region 2.4 Service-Provider/Merchant profile
            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessCode == DomainConstants.DefaultServiceProviderAccessProfile))
                    store.Add(new FeatureAccessProfile
                    {
                        AccessCode = DomainConstants.DefaultServiceProviderAccessProfile,
                        Title = "Default Service-Provider Access Profile",
                        Description = "Defines access privileges for the Service Provider",
                        CreatedBy = DomainConstants.RootAccount,
                        Status = FeatureAccessProfileStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the default access descriptors
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessDescriptor>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.DefaultServiceProviderAccessProfile))
                    new[]
                    {
                        "system/UserAccounts/Services/@add",
                        "system/UserAccounts/Services/@remove",
                        "system/UserAccounts/Services/@modify",
                        "system/UserAccounts/Services/@get",

                        ///Marketplace
                        "system/MarketPlace/Merchant/ProductCategories/@get",
                        "system/MarketPlace/Merchant/ServiceCategories/@get",
                        "system/MarketPlace/Merchant/Products/@search",
                        "system/MarketPlace/Merchant/Services/@search",
                        "system/MarketPlace/Merchant/Orders/@get",
                        "system/MarketPlace/Merchant/Orders/@update",
                        "system/MarketPlace/Merchant/Orders/@fulfill",
                        "system/MarketPlace/Merchant/Services/@add",
                        "system/MarketPlace/Merchant/Services/@modify",
                        "system/MarketPlace/Merchant/ServiceInterface/@add",

                        "system/MarketPlace/Merchant/Services/images/@get",
                        "system/MarketPlace/Merchant/Services/images/@add",
                        "system/MarketPlace/Merchant/Services/images/@remove"

                    }
                    .ForAll((cnt, next) =>
                    {
                        store.Add(new FeatureAccessDescriptor
                        {
                            AccessDescriptor = next,
                            AccessProfileCode = DomainConstants.DefaultServiceProviderAccessProfile,
                            CreatedBy = DomainConstants.RootAccount,
                            Permission = AccessPermission.Grant
                        });
                    });
                    store.Context.CommitChanges();
            });
            #endregion

            #region 2.5 Farmer profile
            //Note: a Farmer is first and foremost, a Service-Provider
            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessCode == DomainConstants.DefaultFarmerAccessProfile))
                    store.Add(new FeatureAccessProfile
                    {
                        AccessCode = DomainConstants.DefaultFarmerAccessProfile,
                        Title = "Default Farmr Access Profile",
                        Description = "Defines access privileges for the farmer",
                        CreatedBy = DomainConstants.RootAccount,
                        Status = FeatureAccessProfileStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the default access descriptors
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessDescriptor>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.DefaultFarmerAccessProfile))
                    new[]
                    {
                        "system/Profiles/Farms/@add",
                        "system/Profiles/Farms/@remove",
                        "system/Profiles/Farms/@modify",
                        "system/Profiles/Farms/@get",
                        "system/MarketPlace/Merchant/Products/@add",
                        "system/MarketPlace/Merchant/Products/@modify",
                        "system/MarketPlace/Merchant/Products/images/@get",
                        "system/MarketPlace/Merchant/Products/images/@add",
                        "system/MarketPlace/Merchant/Products/images/@remove"
                    }
                    .ForAll((cnt, next) =>
                    {
                        store.Add(new FeatureAccessDescriptor
                        {
                            AccessDescriptor = next,
                            AccessProfileCode = DomainConstants.DefaultFarmerAccessProfile,
                            CreatedBy = DomainConstants.RootAccount,
                            Permission = AccessPermission.Grant
                        });
                    });
                store.Context.CommitChanges();
            });
            #endregion

            #region 2.6 Default User profile
            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
                if (!store.Query.Any(_u => _u.AccessCode == DomainConstants.DefaultUserAccessProfile))
                    store.Add(new FeatureAccessProfile
                    {
                        AccessCode = DomainConstants.DefaultUserAccessProfile,
                        Title = "Default User Access Profile",
                        Description = "Defines access privileges for a User",
                        CreatedBy = DomainConstants.RootAccount,
                        Status = FeatureAccessProfileStatus.Active
                    })
                    .Context.CommitChanges();
            });

            //the default access descriptors
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessDescriptor>();
                if (!store.Query.Any(_u => _u.AccessProfileCode == DomainConstants.DefaultUserAccessProfile))
                    new[]
                    {
                        ///profiles
                        "system/Profiles/UserData/@remove",
                        "system/Profiles/UserData/@add",
                        "system/Profiles/UserData/@get",
                        
                        "system/Profiles/BioData/@modify",
                        "system/Profiles/BioData/@get",

                        "system/Profiles/ContactData/@add",
                        "system/Profiles/ContactData/@modify",
                        "system/Profiles/ContactData/@get",
                        "system/Profiles/ContactData/@remove",

                        "system/Profiles/CorporateData/@add",
                        "system/Profiles/CorporateData/@modify",
                        "system/Profiles/CorporateData/@get",
                        "system/Profiles/CorporateData/@remove",

                        ///marketplace
                        "system/MarketPlace/Customer/Products/@search",
                        "system/MarketPlace/Customer/Services/@search",
                        "system/MarketPlace/Customer/Lists/@get",
                        "system/MarketPlace/Customer/List/@remove",
                        "system/MarketPlace/Customer/List/@add",
                        "system/MarketPlace/Customer/Cart/@add",
                        "system/MarketPlace/Customer/Cart/@remove",
                        "system/MarketPlace/Customer/Cart/@pay",
                        "system/MarketPlace/Customer/Orders/@get",
                        "system/MarketPlace/Merchant/Products/images/@get",
                        "system/MarketPlace/Merchant/Services/images/@get",

                        ///misc
                        "system/Profiles/@discover",

                        "system/ActivityFeeds/*",

                        "system/Adverts/@hit",
                        "system/Adverts/@next",

                        "system/Comments/*",
                        "system/Forums/Threads/*",

                        "system/ContextVerifications/*",

                        "system/AccessProfiles/@apply",

                        "system/Notifications/*"
                    }
                    .ForAll((cnt, next) =>
                    {
                        store.Add(new FeatureAccessDescriptor
                        {
                            AccessDescriptor = next,
                            AccessProfileCode = DomainConstants.DefaultUserAccessProfile,
                            CreatedBy = DomainConstants.RootAccount,
                            Permission = AccessPermission.Grant
                        });
                    });
                store.Context.CommitChanges();
            });
            #endregion

            //3. default System settings
            this.UsingContext(context =>
            {
                var store = context.Store<SystemSetting>();
                System.SystemSettings.SettingsList().ForAll((_cnt, _setting) =>
                {
                    if (!store.Query.Any(_ss => _ss.Name == _setting.Name))
                    {
                        store.Add(new SystemSetting
                        {
                            Name = _setting.Name,
                            CreatedBy = DomainConstants.RootAccount,
                            Data = _setting.Data,
                            Type = _setting.Type
                        });
                    }
                });
                store.Context.CommitChanges();
            });
        }
    }

    namespace Util
    {
        public class ReplyMap
        {
            public long CommentId { get; set; }
            public long ParentId { get; set; }
        }

        public class ReplyEntityMap: EntityTypeConfiguration<ReplyMap>
        {

        }
    }
}
