using System;
using System.Collections.Generic;
using Axis.Luna.Extensions;

namespace Gaia.Core.System
{
    /// <summary>
    /// Exposes system settings and their INITIAL values. These values are used to seed the database with initial values.
    /// The values can then be modified via the SystemSettingsService by an administrator.
    /// </summary>
    public static class SystemSettings
    {
        public static readonly KeyValuePair<string, TimeSpan> DefaultContextVerificationExpiration 
            = "System.ContextVerification.DefaultExpiration".ValuePair(TimeSpan.FromDays(1));

        public static readonly KeyValuePair<string, TimeSpan> DefaultUserRegistrationVerificationExpiration 
            = "System.Profiles.UserRegistration.DefaultExpiration".ValuePair(TimeSpan.FromDays(2));

        public static readonly KeyValuePair<string, TimeSpan> DefaultUserActivationVerificationExpiration 
            = "System.Profiles.UserActivation.DefaultExpiration".ValuePair(TimeSpan.FromDays(2));
    }
}
