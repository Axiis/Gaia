using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class FeatureAccessDescriptor: GaiaEntity<long>
    {
        /// <summary>
        /// A possibly wild-carded serviceUri identifying a service/feature or a group of serivces/features
        /// eg: app/Users/Profiles/Discover
        ///     app/Users/Notification/Browse
        ///     app/Forums/Threads/Comments/*
        ///     app/*
        ///     
        /// Note that '/*' means all actions that can be performed on a resource.
        /// The special 'app/*' is meant for the root admin account, giving the account access to everything.
        /// </summary>
        public string AccessDescriptor
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string AccessProfileCode
        {
            get { return get<string>(); }
            set { set(ref value); }

        }

        public AccessPermission Permission
        {
            get { return get<AccessPermission>(); }
            set { set(ref value); }
        }
    }

    public enum AccessPermission
    {
        Grant,
        Deny
    }
}
