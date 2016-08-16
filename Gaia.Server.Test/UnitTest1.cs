using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SimpleInjector;
using SimpleInjector.Extensions.LifetimeScoping;
using Axis.Luna.Extensions;
using Microsoft.Owin.Security.OAuth;
using Gaia.Server.DI;
using Gaia.Server.Controllers.MVC;
using System.Text.RegularExpressions;

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
            Console.WriteLine(match.Success? match.Value : "string did not match");
        }
    }
}
