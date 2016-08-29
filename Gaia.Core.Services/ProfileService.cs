using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;
using static Axis.Luna.Extensions.OperationExtensions;

using static Gaia.Core.DomainConstants;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;
using Axis.Pollux.Authentication;
using Axis.Pollux.Identity.Principal;
using Axis.Pollux.Authentication.Service;

namespace Gaia.Core.Services
{
    public class ProfileService : IProfileService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }
        public ICredentialAuthentication CredentialAuth { get; private set; }
        public IContextVerificationService ContextVerifier { get; private set; }
        public IAccessProfileService AccessManager { get; private set; }
        public Dictionary<string, SystemSetting> SystemSettings { get; private set; }


        public ProfileService(IUserContextService userContext, IDataContext dataContext,
                              ICredentialAuthentication credentialAuthentication,
                              IContextVerificationService contextVerifier,
                              IAccessProfileService accessManager)
        {
            ThrowNullArguments(() => userContext,
                               () => dataContext,
                               () => credentialAuthentication,
                               () => contextVerifier,
                               () => accessManager);

            this.UserContext = userContext;
            this.DataContext = dataContext;
            this.CredentialAuth = credentialAuthentication;
            this.ContextVerifier = contextVerifier;
            this.AccessManager = accessManager;

            //populate system settings
            this.SystemSettings = DataContext.Store<SystemSetting>().Query.ToDictionary(_st => _st.Name);
        }

        public Operation<ContextVerification> RegisterUser(string userId, AccountType accountType, Credential[] secretCredentials)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                if (UserContext.CurrentUser != null || userstore.Query.Any(_user => _user.UserId == userId))
                    throw new Exception($"{userId} already exists");
                else
                {
                    var _user = userstore.NewObject().With(new
                    {
                        Status = UserStatus.Unverified,
                        UserId = userId
                    });
                    userstore.Add(_user).Context.CommitChanges().ThrowIf(r => r <= 0, r => new Exception("failed to register user"));

                    //assign credentials
                    secretCredentials.Where(scred => scred.Metadata.Access == Access.Secret).ForAll((cnt, cred)
                        => CredentialAuth.AssignCredential(userId, cred)
                                         .ThrowIf(op => !op.Succeeded, op => new Exception("failed to assign credential")));

                    //apply the necessary access profile
                    return AccessManager.ApplyAccessProfile(userId,
                                                            accountType == AccountType.Farmer ? DefaultFarmerAccessProfile :
                                                            DefaultServiceProviderAccessProfile,
                                                            null) //<-- null means this profile will never expire

                                        .Then(opr => CreateRegistrationVerification(userId)); //<-- verification
                }
            });

        public Operation<ContextVerification> RegisterAdminUser(string userId, AccountType accountType, Credential[] secretCredentials)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                if (UserContext.CurrentUser != null || userstore.Query.Any(_user => _user.UserId == userId))
                    throw new Exception($"{userId} already exists");
                else
                {
                    var _user = userstore.NewObject().With(new
                    {
                        Status = UserStatus.Unverified,
                        UserId = userId
                    });
                    userstore.Add(_user).Context.CommitChanges().ThrowIf(r => r <= 0, r => new Exception("failed to register user"));

                    //assign credentials
                    secretCredentials.Where(scred => scred.Metadata.Access == Access.Secret).ForAll((cnt, cred)
                        => CredentialAuth.AssignCredential(userId, cred)
                                         .ThrowIf(op => !op.Succeeded, op => new Exception("failed to assign credential")));

                    //apply the necessary access profile
                    return AccessManager.ApplyAccessProfile(userId,
                                                            accountType == AccountType.SystemAdmin ? DefaultSystemAdminAccessProfile :
                                                            DefaultPolicyAdminAccessProfile,
                                                            null) //<-- null means this profile will never expire

                                        .Then(opr => CreateRegistrationVerification(userId)); //<-- verification
                }
            });

        public Operation ModifyBioData(BioData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the biodata

                //persist the biodata
                var _biostore = DataContext.Store<BioData>();
                if (!_biostore.Query.Any(_bd => _bd.OwnerId == _user.UserId))
                    _biostore.Add(data).Context.CommitChanges();

                else _biostore.Modify(data, true);
            });
        
        public Operation ModifyContactData(ContactData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the contact data

                //persist the contact data
                var _contactStore = DataContext.Store<ContactData>();
                if (!_contactStore.Query.Any(_bd => _bd.OwnerId == _user.UserId))
                    _contactStore.Add(data).Context.CommitChanges();

                else _contactStore.Modify(data, true);
            });

        public Operation ModifyCorporateData(CorporateData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the corporate data

                //persist the corporate data
                var _corporateStore = DataContext.Store<CorporateData>();
                if (!_corporateStore.Query.Any(_bd => _bd.OwnerId == _user.UserId))
                    _corporateStore.Add(data).Context.CommitChanges();

                else _corporateStore.Modify(data, true);
            });


        public Operation<ContextVerification> CreateRegistrationVerification(string targetUser)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var setting = DataContext.Store<SystemSetting>().Query
                                         .First(_st => _st.Name == System.SystemSettings.DefaultUserRegistrationVerificationExpiration.Key);
                return ContextVerifier.CreateVerificationObject(targetUser, UserRegistrationContext, DateTime.Now + TimeSpan.Parse(setting.Data));
            });

        public Operation<User> VerifyUserRegistration(string userId, string token)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                return ContextVerifier.VerifyContext(userId, UserRegistrationContext, token)
                                      .Then(opr => userstore.Query
                                                            .Where(_user => _user.UserId == userId)
                                                            .Where(_user => _user.Status == UserStatus.Unverified)
                                                            .FirstOrDefault()
                                                            .ThrowIfNull("could not find user")
                                                            .UsingValue(_user => userstore.Modify(_user.With(new { Status = UserStatus.Active }), true)));
            });


        public Operation AddData(UserData[] data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var userdatastore = DataContext.Store<UserData>();
                List<UserData> existingData = new List<UserData>();

                //retrieve from storage, all data-objects with the same name, belonging to the current user
                data.Batch(200).ForAll((cnt, batch) =>
                {
                    var names = batch.Select(_ud => _ud.Name).ToArray();
                    userdatastore.Query
                                 .Where(_ud => _ud.OwnerId == user.UserId && names.Contains(_ud.Name))
                                 .Pipe(_uds => existingData.AddRange(_uds));
                });

                //persist the difference
                data.Except(existingData, new DataNameComparer())
                    .ForAll((cnt, _data) => userdatastore.Add(_data.With(new { OwnerId = user.UserId })));

                DataContext.CommitChanges();
            });

        public Operation RemoveData(string[] names)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var userdatastore = DataContext.Store<UserData>();
                names.Batch(200).ForAll((cnt, _batch) =>
                {
                    var nar = _batch.ToArray();
                    userdatastore.Query
                                 .Where(_ud => _ud.OwnerId == user.UserId)
                                 .Where(_ud => nar.Contains(_ud.Name))
                                 .Pipe(_uds => userdatastore.Delete(_uds.AsEnumerable()));
                });

                userdatastore.Context.CommitChanges();
            });


        public Operation<User> ArchiveUser(string userid)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                return userstore.Query
                                .Where(_user => _user.UserId == userid)
                                .Where(_user => _user.Status != UserStatus.Archived)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find the non-archived user")
                                .UsingValue(_user => userstore.Modify(_user.With(new { Status = UserStatus.Archived }), true));
            });

        public Operation<ContextVerification> CreateUserActivationVerification(string targetUser)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var setting = DataContext.Store<SystemSetting>().Query
                                         .First(_st => _st.Name == System.SystemSettings.DefaultUserActivationVerificationExpiration.Key);
                return ContextVerifier.CreateVerificationObject(targetUser, UserActivationContext, DateTime.Now + TimeSpan.Parse(setting.Data));
            });

        public Operation<User> VerifyUserActivation(string targetUser, string contextToken)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                return ContextVerifier.VerifyContext(targetUser, UserRegistrationContext, contextToken)
                                      .Then(opr => userstore.Query
                                                            .Where(_user => _user.UserId == targetUser)
                                                            .Where(_user => _user.Status == UserStatus.Archived)
                                                            .FirstOrDefault()
                                                            .ThrowIfNull("could not find user")
                                                            .UsingValue(_user => userstore.Modify(_user.With(new { Status = UserStatus.Active }), true)));
            });


        public Operation<IEnumerable<User>> Discover()
            => FeatureAccess.Guard(UserContext, () => new User[0].AsEnumerable());


        internal class DataNameComparer : IEqualityComparer<UserData>
        {
            public bool Equals(UserData x, UserData y)
            {
                if (x == null && y == null) return true;
                else return x?.Name == y?.Name &&
                            x?.OwnerId == y?.OwnerId;
            }

            public int GetHashCode(UserData obj)
                => obj.PipeOrDefault(_obj => ValueHash(7, 131, obj.OwnerId, obj.Name));
        }
    }
}
