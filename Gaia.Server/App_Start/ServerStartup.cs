using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.Infrastructure;

[assembly: OwinStartup(typeof(Gaia.Server.App_Start.ServerStartup))]

namespace Gaia.Server.App_Start
{
    public class ServerStartup
    {

        public void Configuration(IAppBuilder app)
        {
            ConfigureWebApi(app);
            ConfigureOAuth(app);
        }


        private void ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            app.UseWebApi(config);
        }

        private void ConfigureOAuth(IAppBuilder app)
        {
            app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions
            {
                AuthorizeEndpointPath = new PathString(Paths.AuthorizePath),
                TokenEndpointPath = new PathString(Paths.TokenPath),
                ApplicationCanDisplayErrors = true,

#if DEBUG
                AllowInsecureHttp = true,
#endif

                // Authorization server provider which controls the lifecycle of Authorization Server
                Provider = new OAuthAuthorizationServerProvider
                {
                    OnValidateClientRedirectUri = ValidateClientRedirectUri,
                    OnValidateClientAuthentication = ValidateClientAuthentication,
                    OnGrantResourceOwnerCredentials = GrantResourceOwnerCredentials,
                    OnGrantClientCredentials = GrantClientCredetails
                },

                // Authorization code provider which creates and receives the authorization code.
                AuthorizationCodeProvider = new AuthenticationTokenProvider
                {
                    OnCreate = (tokenCreateContext) =>
                    {
                    },

                    OnReceive = (tokenCreateContext) =>
                    {
                    },
                }
            });
        }


        public class Paths
        {
            static public string AuthorizePath = "/Authorize";
            static public string TokenPath = "/Tokens";
        }
    }
}
