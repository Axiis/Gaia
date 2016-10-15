using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Gaia.Server.DI;
using static Axis.Luna.Extensions.ObjectExtensions;
using System.Web.Http.Dependencies;
using Gaia.Server.OAuth;
using Microsoft.Owin.BuilderProperties;
using System.Threading;
using System;
using SimpleInjector.Integration.WebApi;
using Microsoft.Owin.StaticFiles;
using Gaia.Server.Utils;
using System.Net.Http.Formatting;
using Axis.Luna.Extensions;

using static Axis.Luna.Extensions.EnumerableExtensions;
using Newtonsoft.Json;
using System.Linq;

[assembly: OwinStartup(typeof(Gaia.Server.WebapiStartup))]

namespace Gaia.Server
{
    public class WebapiStartup
    {
        #region Owin Startup
        public void Configuration(IAppBuilder app)
        {
            ConfigureDI(app); //<-- must come first!!!

            ConfigureWebApi(app);
            ConfigureOAuth(app);
            //ConfigureFileServer(app);
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
            app.Properties[OWINMapKeys.ResolutionContext] = new WebApiResolutionContext(new WebApiRequestLifestyle(), DIRegistration.RegisterTypes);

            //shutdown delegate
            var token = new AppProperties(app.Properties).OnAppDisposing;
            if (token != CancellationToken.None)
                token.Register(() => app.Properties[OWINMapKeys.ResolutionContext].As<WebApiResolutionContext>().Dispose());
        }

        private static void ConfigureWebApi(IAppBuilder app)
        {
            new HttpConfiguration().Pipe(config =>
            {
                //change the json formatter
                config.Formatters.Clear();
                config.Formatters.Add(new JsonMediaTypeFormatter
                {
                    SerializerSettings = new JsonSerializerSettings
                    {
                        Converters = Enumerate<JsonConverter>()
                            .Append(new Axis.Apollo.Json.CustomTimeSpanConverter())
                            .Append(new Axis.Apollo.Json.MomentJsDateConverter())
                            .ToList(),
                        MissingMemberHandling = MissingMemberHandling.Ignore,
                        NullValueHandling = NullValueHandling.Ignore,
                        ObjectCreationHandling = ObjectCreationHandling.Auto,
                        FloatFormatHandling = FloatFormatHandling.DefaultValue,
                        PreserveReferencesHandling = PreserveReferencesHandling.All,
                        StringEscapeHandling = StringEscapeHandling.Default
                    }
                });

                //conigure dependency injection
                config.DependencyResolver = app.Properties[OWINMapKeys.ResolutionContext].As<IDependencyResolver>();

                //enable attribute routes
                config.MapHttpAttributeRoutes();

                //apply the configuration
                app.UseWebApi(config);
            });
        }

        private static void ConfigureOAuth(IAppBuilder app)
        {
            app.Properties[OWINMapKeys.ResolutionContext].As<WebApiResolutionContext>().ManagedScope().Using(resolver =>
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
            public static readonly TimeSpan TokenExpiryInterval = TimeSpan.FromHours(1);
        }
        #endregion
    }
}
