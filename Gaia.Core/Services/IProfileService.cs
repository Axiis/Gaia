using Axis.Luna;
using Axis.Pollux.Authentication;
using Axis.Pollux.Authentication.Service;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface IProfileService : IUserContextAware
    {
        ICredentialAuthentication CredentialAuth { get; }

        [Feature("system/Profiles/@register")]
        Operation<ContextVerification> RegisterUser(string targetUser, Credential[] secretCredentials);

        [Feature("system/Profiles/@register-admin")]
        Operation<ContextVerification> RegisterAdminUser(string targetUser, Credential[] secretCredentials);

        [Feature("system/Profiles/@create-registration-verification")]
        Operation<ContextVerification> CreateRegistrationVerification(string targetUser);

        [Feature("system/Profiles/@verify-registration-verification")]
        Operation<User> VerifyUserRegistration(string targetUser, string contextToken);


        [Feature("system/Profiles/BioData/@modify")]
        Operation ModifyBioData(BioData data);

        [Feature("system/Profiles/ContactData/@modify")]
        Operation ModifyContactData(ContactData data);

        [Feature("system/Profiles/Corporate/@modify")]
        Operation ModifyCorporateData(CorporateData data);


        [Feature("system/User/Profile/@add-data")]
        Operation AddData(UserData[] data);

        [Feature("system/User/Profile/@remove-data")]
        Operation RemoveData(string[] names);
        

        [Feature("system/Profiles/@archive-user")]
        Operation<User> ArchiveUser(string targetUser);

        [Feature("system/Profiles/@create-activation-verification")]
        Operation<ContextVerification> CreateUserActivationVerification(string targetUser);

        [Feature("system/User/Profile/@verify-activation-verification")]
        Operation<User> VerifyUserActivation(string targetUser, string contextToken);
        

        [Feature("system/Profiles/@discover")]
        Operation<IEnumerable<User>> Discover();
    }

    public enum AccountType
    {
        SystemUser,
        AdminUser
    }
}
