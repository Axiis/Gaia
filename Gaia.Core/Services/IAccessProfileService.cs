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
        

        [Feature("system/AccessProfiles/@apply")]
        Operation<UserAccessProfile> ApplyAccessProfile(string userId, string accessProfileCode, DateTime? expiryDate);

        [Feature("system/AccessProfiles/@revoke")]
        Operation<UserAccessProfile> RevokeAccessProfile(string userId, string accessProfileCode);

        [Feature("system/AccessProfiles/@migrate")]
        Operation<UserAccessProfile> MigrateAccessProfile(string userId, string oldAccessProfileCode, string newAccessProfileCode, DateTime? newExpiry);

        [Feature("system/AccessProfiles/@get")]
        Operation<IEnumerable<UserAccessProfile>> ActiveUserAccessProfiles(string userId);
    }
}