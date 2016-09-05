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
using Axis.Jupiter;
using Gaia.Server.Controllers;
using Gaia.Core.Services;

namespace Gaia.Server.Test
{
    public class XLocator : IUserLocator
    {
        public string CurrentUser() => "@root";
    }


    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new LifetimeScopeLifestyle();
            container.Options.AllowOverridingRegistrations = true;


            var start = DateTime.Now;
            DIRegistration.RegisterTypes(container);
            container.Register<IUserLocator, XLocator>(Lifestyle.Scoped);
            Console.WriteLine($"registration: {DateTime.Now - start}");

            using (var b = container.BeginLifetimeScope())
            {
                start = DateTime.Now;
                var x = b.GetInstance<IDataContext>();
                Console.WriteLine($"dbcontext: {DateTime.Now - start}");

                start = DateTime.Now;
                var y = b.GetInstance<ProfileController>();
                Console.WriteLine($"profile controller: {DateTime.Now - start}");
            }
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
            var config = new ContextConfiguration<EuropaContext>()
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
