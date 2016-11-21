using System.Text.RegularExpressions;

namespace Gaia.Core
{
    public static class DomainConstants
    {
        public static readonly string UserRegistrationContext = "user-registration";
        public static readonly string UserActivationContext = "user-activation";

        public static readonly string DefaultPolicyAdminAccessProfile = "system.[Policy-Admin Profile]";
        public static readonly string DefaultServiceProviderAccessProfile = "system.[Service-Provider Profile]";
        public static readonly string DefaultFarmerAccessProfile = "system.[Farmer Profile]";
        public static readonly string DefaultUserAccessProfile = "system.[Default-User Profile]";
        public static readonly string DefaultSystemAdminAccessProfile = "system.[Root Profile]";
        public static readonly string GuestAccessProfile = "system.[Guest Profile]";

        public static readonly string RootAccount = "@root";
        public static readonly string GuestAccount = "@guest";

        /// <summary>
        /// Would try to include more punctuation characters into the allowed characters
        /// </summary>
        public static readonly Regex UserIdPattern = new Regex(@"[a-zA-Z0-9_\.\$]{3,}", RegexOptions.IgnoreCase);
    }
}
