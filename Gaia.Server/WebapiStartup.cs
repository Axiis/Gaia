using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Gaia.Server.DI;
using static Axis.Luna.Extensions.ObjectExtensions;
using Gaia.Server.OAuth;
using SimpleInjector.Integration.WebApi;
using Microsoft.Owin.StaticFiles;
using Gaia.Server.Utils;
using System.Net.Http.Formatting;
using Axis.Luna.Extensions;
using Microsoft.Owin.Extensions;

[assembly: OwinStartup(typeof(Gaia.Server.WebapiStartup))]

namespace Gaia.Server
{
    public class WebapiStartup
    {
        #region Owin Startup
        public void Configuration(IAppBuilder app)
        {
            var httpConfig = new HttpConfiguration();

            ConfigureOAuth(app);

            ConfigureDI(app);

            ConfigureWebApi(app, httpConfig);
        }

        private static void ConfigureFileServer(IAppBuilder app)
        {
            app.UseFileServer(new FileServerOptions
            {
                EnableDirectoryBrowsing = false,
                FileSystem = new FilteredFileSystem(".", _path =>
                {
                    return true;
                }),
            });
        }

        private static void ConfigureDI(IAppBuilder app)
        {
            app.UseSimpleInjectorOwinResolutionContext(new WebApiRequestLifestyle(), DIRegistration.RegisterTypes); 
        }

        private static void ConfigureWebApi(IAppBuilder app, HttpConfiguration config)
        {
            //change the json formatter
            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter { SerializerSettings = Constants.DefaultJsonSerializerSettings });

            //conigure dependency injection
            config.DependencyResolver = app.GetSimpleInjectorOwinResolutionContext();

            //enable attribute routes
            config.MapHttpAttributeRoutes();

            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            //config.Filters.Add(new OAuthAuthenticationFilter(OAuthDefaults.AuthenticationType));

            //apply the configuration
            app.UseWebApi(config);
        }

        private static void ConfigureOAuth(IAppBuilder app)
        {
            new SimpleInjectorOwinResolutionContext(new WebApiRequestLifestyle(), DIRegistration.RegisterTypes).UsingValue(resolver =>
            {
                app.Properties["___Gaia_AuthorizationServerContainer"] = resolver;

                var oauthAuthorizeOptions = new OAuthAuthorizationServerOptions
                {
                    //AuthorizeEndpointPath = new PathString(OAuthPaths.CredentialAuthorizationPath),
                    TokenEndpointPath = new PathString(OAuthPaths.TokenPath),
                    ApplicationCanDisplayErrors = true,
                    AccessTokenExpireTimeSpan = Constants.TokenExpiryInterval,
                    AuthenticationType = OAuthDefaults.AuthenticationType,
                    AuthenticationMode = Microsoft.Owin.Security.AuthenticationMode.Active,
                    //AuthorizationCodeProvider = ...,

#if DEBUG
                    AllowInsecureHttp = true,
#endif

                    // Authorization server provider which controls the lifecycle of Authorization Server
                    Provider = resolver.GetService(typeof(IOAuthAuthorizationServerProvider)).As<IOAuthAuthorizationServerProvider>()
                };

                //app.UseOAuthBearerTokens(oauthAuthorizeOptions);
                app.UseOAuthAuthorizationServer(oauthAuthorizeOptions);
                app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

                //app.UseCors(CorsOptions.AllowAll); //<-- will configure this appropriately when it is needed
            });
        }
        
        #endregion
    }
}
