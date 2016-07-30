using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class UserAccessProfile: GaiaEntity<long>
    {
        public string OwnerId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public string AccessProfileCode
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// ignore this in the entity mapping - it should be loaded manually during queries
        /// </summary>
        public FeatureAccessProfile FeatureProfile
        {
            get { return get<FeatureAccessProfile>(); }
            set { set(ref value); }
        }

        public DateTime? ExpiryDate
        {
            get { return get<DateTime?>(); }
            set { set(ref value); }
        }

        public bool UserCancelled
        {
            get { return get<bool>(); }
            set { set(ref value); }
        }
    }
}
