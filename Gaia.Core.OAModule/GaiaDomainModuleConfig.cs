using Axis.Jupiter;
using Axis.Jupiter.Europa;
using Axis.Jupiter.Europa.Module;
using Axis.Luna.Extensions;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;
using Gaia.Core.Domain.Meta;
using Gaia.Core.OAModule.Mappings;
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
            string ns = typeof(AdvertMapping).Namespace,
                   ns2 = typeof(ServiceCategoryMapping).Namespace;
            asm.GetTypes()
               .Where(t => t.Namespace == ns || t.Namespace == ns2)
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
                    ns = typeof(IAdvertService).Namespace;
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
                        "system/User/AccessProfile/@apply",
                        "system/User/ContextVerification/@create-default",
                        "system/User/ContextVerification/@create",
                        "system/User/ContextVerification/@verify"
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

            #region 2.4 Service-Provider profile
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
                        "system/User/Profile/@remove-data",
                        "system/User/Profile/@add-data",
                        "system/Profiles/@discover",
                        "system/Profiles/BioData/@modify",
                        "system/Profiles/ContactData/@modify",
                        "system/Profiles/CorporateData/@modify",

                        "system/User/ActivityFeed/*",

                        "system/Adverts/@hit",
                        "system/Adverts/@next",

                        "system/Comments/*",
                        "system/User/Forum/Thread/*",

                        "system/User/ContextVerification/*",

                        "system/Notifications/*",
                        "system/User/Notification/*",
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
                        "system/User/Profile/@remove-data",
                        "system/User/Profile/@add-data",
                        "system/Profiles/@discover",
                        "system/Profiles/BioData/@modify",
                        "system/Profiles/ContactData/@modify",
                        "system/Profiles/CorporateData/@modify",

                        "system/User/ActivityFeed/*",
                    
                        "system/Adverts/@hit",
                        "system/Adverts/@next",
                    
                        "system/Comments/*",
                        "system/User/Forum/Thread/*",
                    
                        "system/User/ContextVerification/*",
                    
                        "system/Notifications/*",
                        "system/User/Notification/*",
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
