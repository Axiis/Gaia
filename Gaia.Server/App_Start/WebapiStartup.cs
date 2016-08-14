using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.Infrastructure;
using Gaia.Server.DI;
using static Axis.Luna.Extensions.ObjectExtensions;
using System.Web.Http.Dependencies;
using Axis.Luna;
using Gaia.Server.OAuth;
using Microsoft.Owin.BuilderProperties;
using System.Threading;
using System.Linq;
using System;
using Gaia.Core.Domain;
using SimpleInjector.Integration.WebApi;
using SimpleInjector;
using SimpleInjector.Extensions.LifetimeScoping;

[assembly: OwinStartup(typeof(Gaia.Server.App_Start.WebapiStartup))]

namespace Gaia.Server.App_Start
{
    public class WebapiStartup
    {
        #region Owin Startup
        public void Configuration(IAppBuilder app)
        {
            ConfigureDI(app); //<-- must come first!!!

            ConfigureWebApi(app);
            ConfigureOAuth(app);
        }

        private static void ConfigureDI(IAppBuilder app)
        {
            app.Properties[OWINMapKeys.ResolutionContext] = new ResolutionContext(new WebApiRequestLifestyle(), DIRegistration.RegisterTypes);

            //shutdown delegate
            var token = new AppProperties(app.Properties).OnAppDisposing;
            if (token != CancellationToken.None)
                token.Register(() => app.Properties[OWINMapKeys.ResolutionContext].As<ResolutionContext>().Dispose());
        }

        private static void ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            //conigure dependency injection
            config.DependencyResolver = app.Properties[OWINMapKeys.ResolutionContext].As<IDependencyResolver>();

            //enable attribute routes
            config.MapHttpAttributeRoutes();

            //apply the configuration
            app.UseWebApi(config);
        }

        private static void ConfigureOAuth(IAppBuilder app)
        {
            app.Properties[OWINMapKeys.ResolutionContext].As<ResolutionContext>().ManagedScope().Using(resolver =>
            {
                app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions
                {
                    AuthorizeEndpointPath = new PathString(OAuthPaths.CredentialAuthorizationPath),
                    TokenEndpointPath = new PathString(OAuthPaths.TokenPath),
                    ApplicationCanDisplayErrors = true,
                    AccessTokenExpireTimeSpan = DefaultSettings.TokenExpiryInterval,

#if DEBUG
                        AllowInsecureHttp = true,
#endif

                    // Authorization server provider which controls the lifecycle of Authorization Server
                    Provider = resolver.Resolve<IOAuthAuthorizationServerProvider>()
                });

                //app.UseCors(CorsOptions.AllowAll); //<-- will configure this appropriately when it is needed

                app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
                {
                });
            });
        }

        public class OWINMapKeys
        {
            public static readonly string ResolutionContext = "Gaia.Server.OWIN/ResolutionContext";
        }

        public class DefaultSettings
        {
            public static readonly TimeSpan TokenExpiryInterval = TimeSpan.FromDays(1);
        }
        #endregion
    }
}
