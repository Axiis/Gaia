﻿using System;
using System.Collections.Generic;
using Axis.Luna.Extensions;
using Gaia.Core.Domain;

namespace Gaia.Core.System
{
    /// <summary>
    /// Exposes system settings and their INITIAL values. These values are used to seed the database with initial values.
    /// The values can then be modified via the SystemSettingsService by an administrator.
    /// </summary>
    public static class SystemSettings
    {
        public static readonly KeyValuePair<string, long> DefaultContextVerificationExpiration 
            = "System.ContextVerification.DefaultExpiration".ValuePair(TimeSpan.FromDays(1).Ticks);

        public static readonly KeyValuePair<string, long> DefaultUserRegistrationVerificationExpiration 
            = "System.Profiles.UserRegistration.DefaultExpiration".ValuePair(TimeSpan.FromDays(2).Ticks);

        public static readonly KeyValuePair<string, long> DefaultUserActivationVerificationExpiration
            = "System.Profiles.UserActivation.DefaultExpiration".ValuePair(TimeSpan.FromDays(2).Ticks);

        public static readonly KeyValuePair<string, long?> DefaultPasswordExpiration
            = "System.Profiles.Credentials.PasswordExpiration".ValuePair<string,long?>(null);
        

        public static IEnumerable<SystemSetting> SettingsList()
        {
            var l = new List<SystemSetting>();

            //DefaultContextVerificationExpiration
            l.Add(new SystemSetting
            {
                Data = DefaultContextVerificationExpiration.Value.ToString(),
                CreatedBy = DomainConstants.RootAccount,
                Name = DefaultContextVerificationExpiration.Key,
                Type = Axis.Luna.CommonDataType.TimeSpan
            });

            //DefaultUserRegistrationVerificationExpiration
            l.Add(new SystemSetting
            {
                Data = DefaultUserRegistrationVerificationExpiration.Value.ToString(),
                CreatedBy = DomainConstants.RootAccount,
                Name = DefaultUserRegistrationVerificationExpiration.Key,
                Type = Axis.Luna.CommonDataType.TimeSpan
            });

            //DefaultUserActivationVerificationExpiration
            l.Add(new SystemSetting
            {
                Data = DefaultUserActivationVerificationExpiration.Value.ToString(),
                CreatedBy = DomainConstants.RootAccount,
                Name = DefaultUserActivationVerificationExpiration.Key,
                Type = Axis.Luna.CommonDataType.TimeSpan
            });

            //DefaultPasswordExpiration
            l.Add(new SystemSetting
            {
                Data = DefaultPasswordExpiration.Value.ToString(),
                CreatedBy = DomainConstants.RootAccount,
                Name = DefaultPasswordExpiration.Key,
                Type = Axis.Luna.CommonDataType.TimeSpan
            });

            return l;
        }
    }
}
