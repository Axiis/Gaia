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

[assembly: OwinStartup(typeof(Gaia.Server.App_Start.ServerStartup))]

namespace Gaia.Server.App_Start
{
    public class ServerStartup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureDI(app);
            ConfigureWebApi(app);
            ConfigureOAuth(app);
        }

        private void ConfigureDI(IAppBuilder app)
        {
            app.Properties[OWINMapKeys.ResolutionContext] = new ResolutionContext(DIRegistration.RegisterTypes);
        }


        private void ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            //conigure dependency injection
            config.DependencyResolver = app.Properties[OWINMapKeys.ResolutionContext].As<IDependencyResolver>();

            //enable attribute routes
            config.MapHttpAttributeRoutes();

            //apply the configuration
            app.UseWebApi(config);
        }

        private void ConfigureOAuth(IAppBuilder app)
        {
            var resolver = app.Properties[OWINMapKeys.ResolutionContext].As<IServiceResolver>();

            app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions
            {
                AuthorizeEndpointPath = new PathString(OAuthPaths.ThirdpartyAuthorizationPath),
                TokenEndpointPath = new PathString(OAuthPaths.TokenPath),
                ApplicationCanDisplayErrors = true,

#if DEBUG
                AllowInsecureHttp = true,
#endif

                // Authorization server provider which controls the lifecycle of Authorization Server
                Provider = resolver.Resolve<IOAuthAuthorizationServerProvider>(),

                // Authorization code provider which creates and receives the authorization code.
                AuthorizationCodeProvider = resolver.Resolve<IAuthenticationTokenProvider>()
            });

            //app.UseCors(CorsOptions.AllowAll); //<-- will configure this appropriately when it is needed

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
            {
            });
        }

        public class OWINMapKeys
        {
            public static readonly string ResolutionContext = "Gaia.Server.OWIN/ResolutionContext";
        }
    }
}
