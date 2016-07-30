using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Gaia.Core.Domain;
using Axis.Luna.Extensions;
using System.Linq;
using Gaia.Core.Utils;

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
    }
}
