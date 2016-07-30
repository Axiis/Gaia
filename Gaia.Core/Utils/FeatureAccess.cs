using Axis.Luna;
using Axis.Luna.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Linq;
using Gaia.Core.Services;
using Gaia.Core.Domain;
using System.Collections.Concurrent;

namespace Gaia.Core.Utils
{
    public static class FeatureAccess
    {
        private static ConcurrentDictionary<MethodInfo, IEnumerable<string>> CachedDescriptors = new ConcurrentDictionary<MethodInfo, IEnumerable<string>>();

        public static Operation<Out> Guard<Out>(this IUserContextService context, Func<Out> function)
        {
            var frame = new StackFrame(1);
            var profiles = context.UserAccessProfiles();
            return CachedDescriptors.GetOrAdd(frame.GetMethod().As<MethodInfo>(), mi => mi.GetFeatureAttributes().Select(fatt => fatt.URI))
                                    .Any(featureUri => profiles.Any(profile => profile.AllowsAccessTo(featureUri))) ?
                                     Operation.Run(() => function()) :
                                     Operation.Fail<Out>(new Exception());
        }
        public static Operation<Out> Guard<Out>(this IUserContextService context, Func<Operation<Out>> function)
        {
            var frame = new StackFrame(1);
            var profiles = context.UserAccessProfiles();
            return CachedDescriptors.GetOrAdd(frame.GetMethod().As<MethodInfo>(), mi => mi.GetFeatureAttributes().Select(fatt => fatt.URI))
                                    .Any(featureUri => profiles.Any(profile => profile.AllowsAccessTo(featureUri))) ?
                                     Operation.Run(() => function()) :
                                     Operation.Fail<Out>(new Exception());
        }

        public static Operation Guard(this IUserContextService context, Action action)
        {
            var frame = new StackFrame(1);
            var profiles = context.UserAccessProfiles();
            return CachedDescriptors.GetOrAdd(frame.GetMethod().As<MethodInfo>(), mi => mi.GetFeatureAttributes().Select(fatt => fatt.URI))
                                    .Any(featureUri => profiles.Any(profile => profile.AllowsAccessTo(featureUri))) ?
                                     Operation.Run(() => action()) :
                                     Operation.Fail(new Exception());
        }

        private static IEnumerable<FeatureAttribute> GetFeatureAttributes(this MethodInfo method)
            => method.DeclaringType
                     .GetInterfaces()
                     .SelectMany(i => i.GetMethods())
                     .Where(m => method.HasSameSignature(m))
                     .Select(m => m.GetCustomAttribute<FeatureAttribute>())
                     .Where(fatt => fatt != null);

        private static bool HasSameSignature(this MethodInfo method1, MethodInfo method2)
            => method1.Name == method2.Name &&
               method1.ReturnType == method2.ReturnType &&
               method1.GetParameters().SequenceEqual(method2.GetParameters());

        /// <summary>
        /// Review this method!
        /// </summary>
        /// <param name="profile"></param>
        /// <param name="featureURI"></param>
        /// <returns></returns>
        public static bool AllowsAccessTo(this FeatureAccessProfile profile, string featureURI)
            => profile.AccessDescriptors
                      .Where(ad => ad.IsApplicableTo(featureURI))
                      .Combine()
                      .Pipe(_p => _p == AccessPermission.Grant);

        public static bool IsApplicableTo(this FeatureAccessDescriptor descriptor, string featureUri)
            => descriptor.AccessDescriptor.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries)
                         .PairWith(featureUri.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries), true)
                         .Pipe(pairs =>
                         {
                             foreach (var pair in pairs)
                             {
                                 if (pair.Key.Trim().Equals("*")) return true;
                                 else if (pair.Key.Trim().Equals("+") && pair.Value.Trim().StartsWith("@")) return true;
                                 else if (!pair.Key.Trim().Equals(pair.Value.Trim())) return false;
                             }
                             return false;
                         });

        /// <summary>
        /// Combines (aggregates) all permissions for applicable descriptors, favouring "Deny"; this means that if any descriptor denies access,
        /// access is denied, thus, access is granted only if all descriptors grant access. If there are no granting descriptors, access is denied.
        /// </summary>
        /// <param name="descriptors"></param>
        /// <returns></returns>
        public static AccessPermission? Combine(this IEnumerable<FeatureAccessDescriptor> descriptors)
            => descriptors.Select(_d => _d.Permission)
                          .Aggregate(new AccessPermission?(), (reduced, next) => reduced == AccessPermission.Deny ? reduced : next);
    }
}
