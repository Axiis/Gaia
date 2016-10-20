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
    public interface IProfileService : IGaiaService, IUserContextAware
    {
        ICredentialAuthentication CredentialAuth { get; }

        [Feature("system/Profiles/@register")]
        Operation RegisterUser(string targetUser, Credential[] secretCredentials);

        [Feature("system/Profiles/@register-admin")]
        Operation RegisterAdminUser(string targetUser, Credential[] secretCredentials);

        [Feature("system/Profiles/@create-registration-verification")]
        Operation<ContextVerification> CreateRegistrationVerification(string targetUser);

        [Feature("system/Profiles/@verify-registration-verification")]
        Operation VerifyUserRegistration(string targetUser, string contextToken);


        [Feature("system/Profiles/BioData/@modify")]
        Operation ModifyBioData(BioData data);

        [Feature("system/Profiles/BioData/@get")]
        Operation<BioData> GetBioData();


        [Feature("system/Profiles/ContactData/@modify")]
        Operation ModifyContactData(ContactData data);

        [Feature("system/Profiles/ContactData/@remove")]
        Operation RemoveContactData(long[] ids);

        [Feature("system/Profiles/ContactData/@get")]
        Operation<IEnumerable<ContactData>> GetContactData();


        [Feature("system/Profiles/Corporate/@modify")]
        Operation ModifyCorporateData(CorporateData data);

        [Feature("system/Profiles/CorporateData/@remove")]
        Operation RemoveCorporateData(long[] ids);

        [Feature("system/Profiles/Corporate/@get")]
        Operation<IEnumerable<CorporateData>> GetCorporateData();


        [Feature("system/Profiles/UserData/@add")]
        Operation AddData(UserData[] data);

        [Feature("system/Profiles/UserData/@remove")]
        Operation RemoveData(string[] names);

        [Feature("system/Profiles/UserData/@get")]
        Operation<IEnumerable<UserData>> GetUserData();


        [Feature("system/Profiles/@archive-user")]
        Operation<User> ArchiveUser(string targetUser);

        [Feature("system/Profiles/@create-activation-verification")]
        Operation<ContextVerification> CreateUserActivationVerification(string targetUser);

        [Feature("system/Profiles/@verify-activation-verification")]
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
