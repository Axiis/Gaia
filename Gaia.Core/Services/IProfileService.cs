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

        #region Biodata
        [Feature("system/Profiles/BioData/@modify")]
        Operation ModifyBioData(BioData data);

        [Feature("system/Profiles/BioData/@get")]
        Operation<BioData> GetBioData();
        #endregion

        #region Contact data
        [Feature("system/Profiles/ContactData/@add")]
        Operation<long> AddContactData(ContactData data);

        [Feature("system/Profiles/ContactData/@modify")]
        Operation ModifyContactData(ContactData data);

        [Feature("system/Profiles/ContactData/@remove")]
        Operation RemoveContactData(long[] ids);

        [Feature("system/Profiles/ContactData/@get")]
        Operation<IEnumerable<ContactData>> GetContactData();
        #endregion

        #region Corporate Data
        [Feature("system/Profiles/CorporateData/@add")]
        Operation<long> AddCorporateData(CorporateData data);

        [Feature("system/Profiles/CorporateData/@modify")]
        Operation ModifyCorporateData(CorporateData data);

        [Feature("system/Profiles/CorporateData/@remove")]
        Operation RemoveCorporateData(long[] ids);

        [Feature("system/Profiles/CorporateData/@get")]
        Operation<IEnumerable<CorporateData>> GetCorporateData();
        #endregion

        #region User data
        [Feature("system/Profiles/UserData/@add")]
        Operation<IEnumerable<long>> AddData(UserData[] data);

        [Feature("system/Profiles/UserData/@remove")]
        Operation RemoveData(string[] names);

        [Feature("system/Profiles/UserData/@get")]
        Operation<IEnumerable<UserData>> GetUserData();

        [Feature("system/Profiles/UserData/@get")]
        Operation<UserData> GetUserData(string name);

        [Feature("system/Profiles/UserData/@add")]
        Operation<string> UpdateProfileImage(EncodedBinaryData image, string oldImageUrl);
        #endregion

        #region Farm
        [Feature("system/Profiles/Farms/@add")]
        Operation<long> AddFarmAccount(Farm data);

        [Feature("system/Profiles/Farms/@modify")]
        Operation ModifyFarmAccount(Farm data);

        [Feature("system/Profiles/Farms/@remove")]
        Operation RemoveFarmAccount(long[] ids);

        [Feature("system/Profiles/Farms/@get")]
        Operation<IEnumerable<Farm>> GetFarmAccounts();
        #endregion


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
