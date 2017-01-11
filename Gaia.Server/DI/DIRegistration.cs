#region imports
using Gaia.Core.Domain;
using Gaia.Server.OAuth;
using Microsoft.Owin.Security.OAuth;
using SimpleInjector;
using System.Linq;

using static Axis.Luna.Extensions.TypeExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;
using Gaia.Core.Services;
using System.Web.Http;
using Axis.Jupiter.Europa;
using Axis.Jupiter;
using Axis.Pollux.Identity.Principal;
using Axis.Pollux.Authentication;
using Axis.Pollux.CoreAuthentication.Services;
using Axis.Pollux.Authentication.Service;
using Axis.Pollux.RBAC.Auth;
using Axis.Pollux.RBAC.Services;
using Axis.Pollux.Identity.OAModule;
using Axis.Pollux.Authentication.OAModule;
using Axis.Pollux.RBAC.OAModule;
using Gaia.Core.OAModule;
using Axis.Pollux.CoreAuthentication;
using System.Configuration;
using Gaia.Server.Services;
#endregion

namespace Gaia.Server.DI
{
    public static class DIRegistration
    {
        public static void RegisterTypes(Container c)
        {
            var coreAssembly = typeof(GaiaEntity<>).Assembly;
            var serviceAssembly = typeof(BaseService).Assembly;

            #region infrastructure service registration

            //authorization server is a special case where it is created in the singleton scope, but relies on some services that are registered in ScopedLifeStyles...
            //thus we explicitly create the instance of the authorization server.
            c.Register<IOAuthAuthorizationServerProvider>(() => c.GetInstance<AuthorizationServer>());
            c.Register(() =>
            {
                var europa = new EuropaContext(c.GetInstance<ContextConfiguration<EuropaContext>>());
                var credentialAuthenticator = new CredentialAuthentication(europa, new DefaultHasher());
                return new AuthorizationServer(credentialAuthenticator, europa);
            }, Lifestyle.Singleton);
                        
            c.Register<ICredentialHasher, DefaultHasher>(Lifestyle.Scoped);

            //owin context provider
            c.Register<IOwinContextProvider, CallContextOwinProvider>(Lifestyle.Scoped);


            c.Register<IUserLocator, UserLocator>(Lifestyle.Scoped);
            c.Register<IBlobStoreService, FileSystemBlobStore>(Lifestyle.Scoped);
            #endregion


            #region domain/domain-service registration

            #region Jupiter

            //shared context configuration.
            var config = new ContextConfiguration<EuropaContext>()
                .WithConnection(ConfigurationManager.ConnectionStrings["EuropaContext"].ConnectionString)
                .WithEFConfiguraton(_efc =>
                {
                    _efc.LazyLoadingEnabled = false;
                    _efc.ProxyCreationEnabled = false;
                })
                .WithInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<EuropaContext>())
                .UsingModule(new IdentityAccessModuleConfig())
                .UsingModule(new AuthenticationAccessModuleConfig())
                .UsingModule(new RBACAccessModuleConfig())
                .UsingModule(new GaiaDomainModuleConfig());
            c.Register(() => config, Lifestyle.Scoped);

            c.Register<IDataContext, EuropaContext>(Lifestyle.Scoped);


            #endregion

            #region Axis.Pollux.Identity

            //objects
            var polluxEntityType = typeof(PolluxEntity<>);
            typeof(User).Assembly
                .GetTypes()
                .Where(_t => _t.BaseTypes().Any(_bt => !_bt.IsGenericTypeDefinition && _bt.IsGenericType && _bt.GetGenericTypeDefinition().Equals(polluxEntityType)))
                .ForAll((_cnt, _t) => c.Register(_t));
            #endregion

            #region Axis.Pollux.Authentication

            //objects
            typeof(Credential).Assembly
                .GetTypes()
                .Where(_t => _t.BaseTypes().Any(_bt => !_bt.IsGenericTypeDefinition && _bt.IsGenericType && _bt.GetGenericTypeDefinition().Equals(polluxEntityType)))
                .ForAll((_cnt, _t) => c.Register(_t));

            //services
            var polluxAuthServiceImplAssembly = typeof(CredentialAuthentication).Assembly;
            typeof(ICredentialAuthentication).Assembly
                .GetTypes()
                .Where(_t => _t.Namespace?.Equals("Axis.Pollux.Authentication.Service") ?? false)
                .Where(_t => _t.IsInterface)
                //.Where(_t => !_t.Equals(typeof(ICredentialAuthentication)))
                .Select(_t => new { @interface = _t, implementation = polluxAuthServiceImplAssembly.GetTypes().FirstOrDefault(_impl => _impl.GetInterfaces().Contains(_t)) })
                .Where(_pair => _pair.implementation != null)
                .ForAll((_cnt, _pair) => c.Register(_pair.@interface, _pair.implementation, Lifestyle.Scoped));
            #endregion

            #region Axis.Pollux.RBAC

            //objects
            typeof(UserRole).Assembly
                .GetTypes()
                .Where(_t => _t.BaseTypes().Any(_bt => !_bt.IsGenericTypeDefinition && _bt.IsGenericType && _bt.GetGenericTypeDefinition().Equals(polluxEntityType)))
                .ForAll((_cnt, _t) => c.Register(_t));

            //services
            var polluxRBACServiceImplAssembly = typeof(RoleAuthority).Assembly;
            typeof(IUserAuthorization).Assembly
                .GetTypes()
                .Where(_t => _t.Namespace?.Equals("Axis.Pollux.RBAC.Services") ?? false)
                .Where(_t => _t.IsInterface)
                .Select(_t => new { @interface = _t, implementation = polluxRBACServiceImplAssembly.GetTypes().FirstOrDefault(_impl => _impl.GetInterfaces().Contains(_t)) })
                .Where(_pair => _pair.implementation != null)
                .ForAll((_cnt, _pair) => c.Register(_pair.@interface, _pair.implementation, Lifestyle.Scoped));

            #endregion

            #region Gaia.Domain/Gaia.Domain.Services

            //objects
            var gaiaEntityType = typeof(GaiaEntity<>);
            coreAssembly.GetTypes()
                .Where(_t => _t.BaseTypes().Any(_bt => !_bt.IsGenericTypeDefinition && _bt.IsGenericType && _bt.GetGenericTypeDefinition().Equals(gaiaEntityType)))
                .ForAll((_cnt, _t) => c.Register(_t));

            //services
            var gaiaService = typeof(IGaiaService);
            var gaiaBaseService = typeof(BaseService);
            gaiaEntityType.Assembly.GetTypes()
                .Where(_t => _t.IsInterface)
                .Where(_t => _t.GetInterfaces().Contains(gaiaService))
                .Select(_t => new { @interface = _t, implementation = serviceAssembly.GetTypes().FirstOrDefault(_impl => _impl.GetInterfaces().Contains(_t)) })
                .Where(_pair => _pair.implementation != null)
                .ForAll((_cnt, _pair) => c.Register(_pair.@interface, _pair.implementation, Lifestyle.Scoped));

            #endregion

            #region Others


            #endregion

            #endregion


            #region webapi controller registration
            var wapict = typeof(ApiController);
            typeof(DIRegistration).Assembly.GetTypes()
                                  .Where(_t => _t.BaseTypes().Contains(wapict))
                                  .ForAll((_cnt, _t) => c.Register(_t, _t, Lifestyle.Scoped));
            #endregion

        }
    }
}