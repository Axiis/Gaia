using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SimpleInjector;
using SimpleInjector.Extensions.LifetimeScoping;
using Axis.Luna.Extensions;
using Microsoft.Owin.Security.OAuth;
using Gaia.Server.DI;
using Gaia.Server.Controllers.MVC;
using System.Text.RegularExpressions;
using System.IO;
using Axis.Jupiter.Europa;
using Axis.Pollux.Identity.OAModule;
using Axis.Pollux.Authentication.OAModule;
using Axis.Pollux.RBAC.OAModule;
using Gaia.Core.OAModule;
using Axis.Pollux.Identity.Principal;
using System.Linq;

namespace Gaia.Server.Test
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new LifetimeScopeLifestyle();

            DIRegistration.RegisterTypes(container);

            container.BeginLifetimeScope().Using(scoped =>
            {
                var server = scoped.GetInstance<IOAuthAuthorizationServerProvider>();
            });
        }

        [TestMethod]
        public void TestMethod2()
        {
            var FilePart = new Regex(@"^[^\#\?]+(?=([\?\#]|$))");
            var match = FilePart.Match("dfda/fdfa.htm");
            Console.WriteLine(match.Success ? match.Value : "string did not match");
        }

        [TestMethod]
        public void TestMethod3()
        {
            var config = new ContextConfiguration()
                .WithConnection("EuropaContext")
                .WithEFConfiguraton(dbconfig => dbconfig.LazyLoadingEnabled = true)
                .WithInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<EuropaContext>())
                .UsingModule(new IdentityAccessModuleConfig())
                .UsingModule(new AuthenticationAccessModuleConfig())
                .UsingModule(new RBACAccessModuleConfig())
                .UsingModule(new GaiaDomainModuleConfig());

            var context = new EuropaContext(config);

            var u  = context.Store<User>().Query.FirstOrDefault();
        }
    }
}
