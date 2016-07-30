using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Web.Http;

[assembly: OwinStartup(typeof(Gaia.Server.App_Start.ServerStartup))]

namespace Gaia.Server.App_Start
{
    public class ServerStartup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureWebApi(app);
        }


        private void ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            app.UseWebApi(config);
        }
    }
}
