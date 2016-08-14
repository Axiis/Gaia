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
                var commentTable = context.ContextMetadata.TypeMetadata<Comment>().Table.TableName;
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
                ns = typeof(IAdvertService).Namespace;
                asm.GetTypes()
                   .Where(t => t.Namespace == ns)
                   .Where(t => t.IsInterface)
                   .SelectMany(i => i.GetMethods())
                   .SelectMany(im => im.GetCustomAttributes<FeatureAttribute>())
                   .Where(fatt => fatt != null)
                   .ForAll((cnt, fatt) => store.Add(new FeatureURI { Name = fatt.Name, URI = fatt.URI }));
            });

            //2. Seed the system with the default access-profiles

            #region 2.1 Root user/profile
            //the user object
            this.UsingContext(context => context.Store<User>().Add(new User { UserId = DomainConstants.RootAccount, Status = UserStatus.Active }).Context.CommitChanges());

            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
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
                store.Add(new UserAccessProfile
                {
                    CreatedBy = DomainConstants.RootAccount,
                    ExpiryDate = null, //<- meaning, never expire!
                    AccessProfileCode = DomainConstants.DefaultSystemAdminAccessProfile,
                    OwnerId = DomainConstants.RootAccount
                })
                .Context.CommitChanges();
            });
            #endregion

            #region 2.2 Guest user/profile
            //the user object
            this.UsingContext(context => context.Store<User>().Add(new User { UserId = DomainConstants.GuestAccount, Status = UserStatus.Active }).Context.CommitChanges());

            //the profile object
            this.UsingContext(context =>
            {
                var store = context.Store<FeatureAccessProfile>();
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
                new[]
                {
                    "system/Profiles/@register",
                    "system/Profiles/@create-activation-verification",
                    "system/Profiles/@verify-activation-verification",
                    "system/Profiles/@create-registration-verification",
                    "system/Profiles/@verify-activation-verification",
                    "system/User/AccessProfile/@apply"
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
            });

            //assign the profile to the user
            this.UsingContext(context =>
            {
                var store = context.Store<UserAccessProfile>();
                store.Add(new UserAccessProfile
                {
                    CreatedBy = DomainConstants.RootAccount,
                    ExpiryDate = null, //<- meaning, never expire!
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
                new[]
                {
                    "system/User/Profile/@remove-data",
                    "system/User/Profile/@add-data",
                    "system/Profiles/@discover",

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
                new[]
                {
                    "system/User/Profile/@remove-data",
                    "system/User/Profile/@add-data",
                    "system/Profiles/@discover",

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
