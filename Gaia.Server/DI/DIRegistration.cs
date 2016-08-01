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

namespace Gaia.Server.DI
{
    public static class DIRegistration
    {
        public static void RegisterTypes(Container c)
        {

            #region infrastructure service registration
            c.Register<AuthorizationServer>(Lifestyle.Singleton);
            c.Register<IOAuthAuthorizationServerProvider>(() => c.GetInstance<AuthorizationServer>());
            c.Register<IAuthenticationTokenProvider>(() => c.GetInstance<AuthorizationServer>());


            c.Register<TokenStore>(Lifestyle.Singleton);

            #endregion


            #region domain/domain-service registration

            #region Axis.Pollux.Identity

            #endregion

            #region Axis.Pollux.RBAC

            #endregion

            #region Axis.Pollux.Authentication

            #endregion

            #region Gaia.Domain/Gaia.Domain.Services
            //objects
            var gaiaEntityType = typeof(GaiaEntity<>);
            gaiaEntityType.Assembly.GetTypes()
                          .Where(_t => _t.BaseTypes().Any(_bt => _bt.IsGenericType && (_bt.GetGenericTypeDefinition()?.Equals(gaiaEntityType) ?? false)))
                          .ForAll((_cnt, _t) => c.Register(_t));

            //services
            var gaiaBaseService = typeof(BaseService);
            var serviceImplAssembly = gaiaBaseService.Assembly;
            gaiaEntityType.Assembly.GetTypes()
                          .Where(_t => _t.Namespace.Equals("Gaia.Core.Services"))
                          .Where(_t => _t.IsInterface)
                          .Select(_t => new { @interface = _t, implementation = serviceImplAssembly.GetTypes().FirstOrDefault(_impl => _impl.GetInterfaces().Contains(_t)) })
                          .Where(_pair => _pair.implementation != null)
                          .ForAll((_cnt, _pair) => c.Register(_pair.@interface, _pair.implementation));
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