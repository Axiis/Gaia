using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface IAccessProfileService : IGaiaService, IUserContextAware
    {
        [Feature("system/AccessProfile/@create")]
        Operation<FeatureAccessProfile> CreateFeatureAccessProfile(string profileCode, string title);

        [Feature("system/AccessProfiles/@modify")]
        Operation<FeatureAccessProfile> ModifyFeatureAccessProfile(FeatureAccessProfile profile, string[] grantedDescriptors, string[] deniedDescriptors);

        [Feature("system/AccessProfiles/@archive")]
        Operation ArchiveAccessProfile(long profileId);
        

        [Feature("system/User/AccessProfile/@apply")]
        Operation<UserAccessProfile> ApplyAccessProfile(string userId, string accessProfileCode, DateTime? expiryDate);

        [Feature("system/User/AccessProfile/@revoke")]
        Operation<UserAccessProfile> RevokeAccessProfile(string userId, string accessProfileCode);

        [Feature("system/User/AccessProfile/@migrate")]
        Operation<UserAccessProfile> MigrateAccessProfile(string userId, string oldAccessProfileCode, string newAccessProfileCode, DateTime? newExpiry);

        [Feature("system/User/AccessProfiles/@get")]
        Operation<IEnumerable<UserAccessProfile>> ActiveUserAccessProfiles(string userId);
    }
}