using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Gaia.Core.Domain;
using Axis.Luna.Extensions;
using System.Linq;
using Gaia.Core.Utils;
using Axis.Jupiter.Europa;
using System.Configuration;
using Axis.Pollux.Identity.OAModule;
using Axis.Pollux.Authentication.OAModule;
using Axis.Pollux.RBAC.OAModule;
using Gaia.Core.OAModule;
using System.Data.Entity;
using Gaia.Core.Domain.Accounts;
using Gaia.Core.Domain.MarketPlace;
using Marketplace = Gaia.Core.Domain.MarketPlace;

namespace Test.Gaia.Domain
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod2()
        {
            Console.WriteLine(Enumerable.Range(0, 0).Aggregate((x, y) => 3));
        }


        [TestMethod]
        public void TestMethod1()
        {
            var descriptors = new[]
            {
                "system/User/Profile/@remove-data",
                "system/User/Profile/@add-data",
                "system/Profiles/@discover",

                "system/User/ActivityFeed/*",

                "system/Adverts/@hit",
                "system/Adverts/@next",

                "system/Comments/*",
                "system/User/Forum/Thread/*",

                "system/User/ContextVerification/*",

                "system/Notifications/*",
                "system/User/Notification/*",
            }
            .Select(next => new FeatureAccessDescriptor
            {
                AccessDescriptor = next,
                AccessProfileCode = "system.[Farmer Profile]",
                CreatedBy = "@root",
                Permission = next.Contains("Profile") ? AccessPermission.Deny : AccessPermission.Grant
            })
            .ToArray();

            var accessProfile = new FeatureAccessProfile { AccessCode = "system.[Farmer Profile]" };
            accessProfile.AccessDescriptors.AddRange(descriptors);

            Console.WriteLine(descriptors.Combine());

            string testUri = "system/User/ActivityFeed/@something",
                   testUri2 = "system/Users/Nonexistent/@bleh";
            Console.WriteLine($"{descriptors[3].AccessDescriptor} is applicable to {testUri}: {descriptors[0].IsApplicableTo(testUri)}");
            Console.WriteLine($"{descriptors[3].AccessDescriptor} is applicable to {testUri2}: {descriptors[0].IsApplicableTo(testUri2)}");


            var start = DateTime.Now;
            Console.WriteLine($"allow access to {testUri}: {accessProfile.AllowsAccessTo(testUri)} in {DateTime.Now - start}");

            start = DateTime.Now;
            Console.WriteLine($"allow access to {testUri2}: {accessProfile.AllowsAccessTo(testUri2)} in {DateTime.Now - start}");
        }


        [TestMethod]
        public void TestMethod3()
        {
            var start = DateTime.Now;

            //shared context configuration.
            var config = new ContextConfiguration<EuropaContext>()
                .WithConnection(ConfigurationManager.ConnectionStrings["EuropaContext"].ConnectionString)
                .WithEFConfiguraton(_efc =>
                {
                    _efc.LazyLoadingEnabled = false;
                    _efc.ProxyCreationEnabled = false;
                })
                .WithInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<EuropaContext>())
                .UsingModule(new IdentityAccessModuleConfig())
                .UsingModule(new AuthenticationAccessModuleConfig())
                .UsingModule(new RBACAccessModuleConfig())
                .UsingModule(new GaiaDomainModuleConfig());

            var context = new EuropaContext(config);

            //Console.WriteLine($"1st Configuration compiled in: {DateTime.Now - start}");

            //start = DateTime.Now;
            //context = new EuropaContext(config);
            //Console.WriteLine($"2nd Configuration compiled in: {DateTime.Now - start}");

            //start = DateTime.Now;
            //context = new EuropaContext(config);
            //Console.WriteLine($"3rd Configuration compiled in: {DateTime.Now - start}");

            //start = DateTime.Now;
            //context = new EuropaContext(config);
            //Console.WriteLine($"5th Configuration compiled in: {DateTime.Now - start}");

            //start = DateTime.Now;
            //var _context = new DbContext(ConfigurationManager.ConnectionStrings["EuropaContext"].ConnectionString);
            //_context.SaveChanges();
            //Console.WriteLine($"5th Configuration compiled in: {DateTime.Now - start}");


            //var s = context.Store<Service>().Query.FirstOrDefault();

            //Console.WriteLine($"[service-description:{s.Description}] [user: {s.OwnerId}] [userObject: {s.Owner != null}]");

            //var u = context.Store<Axis.Pollux.Identity.Principal.User>().Query.FirstOrDefault(_u => _u.EntityId == "stanley.damasus@gmail.com");
            //Console.WriteLine($"[user:{u.UserId}]");

            //var s2 = context.Store<Service>().Query.OrderBy(_u => _u.EntityId).Skip(1).FirstOrDefault();
            //Console.WriteLine($"[service-description:{s2.Description}] [user: {s2.OwnerId}] [userObject: {s2.Owner != null}]");

        }

        [TestMethod]
        public void TestMethod4()
        {
            var r = new Random(Guid.NewGuid().GetHashCode());
            var s = IdGenerator.NewId(Marketplace.Order.TransactionIdFormat, r);

            var collisions = 0L;
            for(int cnt=0;cnt<1; cnt++)
            {
                if (s == IdGenerator.NewId(Marketplace.Order.TransactionIdFormat, r)) collisions++;
            }

            Console.WriteLine(collisions);

            Assert.AreEqual(false, collisions > 0);
        }
    }
}
