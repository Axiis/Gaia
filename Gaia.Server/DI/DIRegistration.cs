using Gaia.Core.Domain;
using Gaia.Server.OAuth;
using Microsoft.Owin.Security.Infrastructure;
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

namespace Gaia.Server.DI
{
    public static class DIRegistration
    {
        public static void RegisterTypes(Container c)
        {

            #region infrastructure service registration
            c.Register<AuthorizationServer>();
            c.Register<IOAuthAuthorizationServerProvider>(() => c.GetInstance<AuthorizationServer>());


            c.Register<ICredentialAuthentication, CredentialAuthentication>();
            c.Register<ICredentialHasher, DefaultHasher>();
            #endregion


            #region domain/domain-service registration

            #region Jupiter
            c.Register<IDataContext>(() =>
            {
                var config = new ContextConfiguration()
                    .WithConnection("EuropaContext")
                    .WithInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<EuropaContext>())
                    .UsingModule(new IdentityAccessModuleConfig())
                    .UsingModule(new AuthenticationAccessModuleConfig())
                    .UsingModule(new RBACAccessModuleConfig())
                    .UsingModule(new GaiaDomainModuleConfig());

                return new EuropaContext(config);
            }, 
            Lifestyle.Scoped);
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
                .Where(_t => !_t.Equals(typeof(ICredentialAuthentication)))
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
            gaiaEntityType.Assembly.GetTypes()
                          .Where(_t => _t.BaseTypes().Any(_bt => !_bt.IsGenericTypeDefinition && _bt.IsGenericType && _bt.GetGenericTypeDefinition().Equals(gaiaEntityType)))
                          .ForAll((_cnt, _t) => c.Register(_t));

            //services
            var gaiaBaseService = typeof(BaseService);
            var serviceImplAssembly = gaiaBaseService.Assembly;
            gaiaEntityType.Assembly.GetTypes()
                          .Where(_t => _t.Namespace?.Equals("Gaia.Core.Services") ?? false)
                          .Where(_t => _t.IsInterface)
                          .Select(_t => new { @interface = _t, implementation = serviceImplAssembly.GetTypes().FirstOrDefault(_impl => _impl.GetInterfaces().Contains(_t)) })
                          .Where(_pair => _pair.implementation != null)
                          .ForAll((_cnt, _pair) => c.Register(_pair.@interface, _pair.implementation, Lifestyle.Scoped));
            #endregion

            #region Others

            c.Register<IUserLocator, Services.UserLocator>(Lifestyle.Scoped);

            #endregion

            #endregion


            #region webapi controller registration
            var wapict = typeof(ApiController);
            typeof(DIRegistration).Assembly.GetTypes()
                                  .Where(_t => _t.BaseTypes().Contains(wapict))
                                  .ForAll((_cnt, _t) => c.Register(_t));
            #endregion

        }
    }
}