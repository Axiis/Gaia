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
using Gaia.Core.System;
using Mail = System.Net.Mail;

namespace Gaia.Core.Services
{
    public class ProfileService : IProfileService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }
        public ICredentialAuthentication CredentialAuth { get; private set; }
        public IContextVerificationService ContextVerifier { get; private set; }
        public IAccessProfileService AccessManager { get; private set; }
        public IBlobStoreService BlobStore { get; private set; }
        public IMailPushService MessagePush { get; private set; }
        public Dictionary<string, SystemSetting> SystemSettings { get; private set; }


        public ProfileService(IUserContextService userContext, IDataContext dataContext,
                              ICredentialAuthentication credentialAuthentication,
                              IContextVerificationService contextVerifier,
                              IAccessProfileService accessManager,
                              IBlobStoreService blobStore,
                              IMailPushService messagePush)
        {
            ThrowNullArguments(() => userContext,
                               () => dataContext,
                               () => credentialAuthentication,
                               () => contextVerifier,
                               () => accessManager,
                               () => blobStore,
                               () => messagePush);

            this.UserContext = userContext;
            this.DataContext = dataContext;
            this.CredentialAuth = credentialAuthentication;
            this.ContextVerifier = contextVerifier;
            this.AccessManager = accessManager;
            this.BlobStore = blobStore;
            this.MessagePush = messagePush;

            //populate system settings
            this.SystemSettings = DataContext.Store<SystemSetting>().Query.ToDictionary(_st => _st.Name);
        }

        public Operation RegisterUser(string userId, Credential[] secretCredentials)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                if (UserContext.CurrentUser == null || userstore.Query.Any(_user => _user.EntityId == userId))
                    throw new Exception($"{userId} already exists");

                else if (secretCredentials == null || secretCredentials.Length == 0)
                    throw new Exception("user registration must contain a credential");

                else
                {
                    userstore.NewObject().Do(__user =>
                    {
                        __user.Status = UserStatus.Unverified;
                        __user.UserId = userId;

                        userstore.Add(__user).Context
                            .CommitChanges()
                            .ThrowIf(r => r <= 0, r => new Exception("failed to register user"));
                    });

                    //assign credentials
                    //load all credential expiration dates from settings
                    var settings = DataContext.Store<SystemSetting>().Query.ToArray();
                    secretCredentials.Where(scred => scred.Metadata.Access == Access.Secret).ToArray().ForAll((cnt, cred) =>
                    {
                        settings.FirstOrDefault(s => s.Name.Contains($"{cred.Metadata.Name}Expiration")).DoIf(s => s != null, s =>
                        {
                            long temp;
                            if (long.TryParse(s.Data, out temp)) cred.ExpiresIn = temp;
                            else cred.ExpiresIn = null; //<-- never expires
                        });
                        CredentialAuth.AssignCredential(userId, cred)
                            .ThrowIf(op => !op.Succeeded, op => new Exception("failed to assign credential"));
                    });

                    ///create necessary "default" information for the user

                    //apply the necessary access profile
                    AccessManager.ApplyAccessProfile(userId,
                                                     DefaultUserAccessProfile,
                                                     null) //<-- null means this profile will never expire
                                 .Then(opr => CreateRegistrationVerification(userId)) //<-- verification
                                 .Then(opr =>
                                 {
                                     //construct the email that gets sent to the user
                                     var mail = new Mail.MailMessage();

                                     MessagePush.Push(mail).Resolve();
                                 })
                                 .Resolve();
                }
            });

        public Operation RegisterAdminUser(string userId, Credential[] secretCredentials)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                if (UserContext.CurrentUser == null || userstore.Query.Any(_user => _user.EntityId == userId))
                    throw new Exception($"{userId} already exists");
                else
                {
                    userstore.NewObject().Do(__user =>
                    {
                        __user.Status = UserStatus.Unverified;
                        __user.UserId = userId;

                        userstore.Add(__user).Context
                            .CommitChanges()
                            .ThrowIf(r => r <= 0, r => new Exception("failed to register user"));
                    });

                    //assign credentials
                    secretCredentials.Where(scred => scred.Metadata.Access == Access.Secret).ForAll((cnt, cred)
                        => CredentialAuth.AssignCredential(userId, cred)
                                         .ThrowIf(op => !op.Succeeded, op => new Exception("failed to assign credential")));

                    //apply the necessary access profile
                    AccessManager.ApplyAccessProfile(userId,
                                                     DefaultPolicyAdminAccessProfile,
                                                     null) //<-- null means this profile will never expire
                                 .Then(opr => CreateRegistrationVerification(userId)) //<-- verification
                                 .Then(opr =>
                                  {
                                      //construct the email that gets sent to the user
                                      var mail = new Mail.MailMessage();

                                      MessagePush.Push(mail);
                                  })
                                  .Resolve();
                }
            });


        public Operation<ContextVerification> CreateRegistrationVerification(string targetUser)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var setting = DataContext.Store<SystemSetting>().Query
                                         .First(_st => _st.Name == System.SystemSettings.DefaultUserRegistrationVerificationExpiration.Key);
                return ContextVerifier.CreateVerificationObject(targetUser, UserRegistrationContext, DateTime.Now + TimeSpan.FromTicks(long.Parse(setting.Data)));
            });

        public Operation VerifyUserRegistration(string userId, string token)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                if (userstore.Query.Any(_user => _user.EntityId == userId && _user.Status != UserStatus.Unverified))
                    throw new Exception("invalid operation: user is already Active");

                else ContextVerifier.VerifyContext(userId, UserRegistrationContext, token)
                    .Then(opr => userstore.Query
                    .Where(_user => _user.EntityId == userId)
                    .Where(_user => _user.Status == UserStatus.Unverified)
                    .FirstOrDefault()
                    .ThrowIfNull("could not find user")
                    .Do(_user =>
                    {
                        _user.Status = UserStatus.Active;
                        userstore.Modify(_user, true);
                    }))
                    .ThrowIf(opr => !opr.Succeeded, opr => opr.GetException());
            });



        public Operation<User> ArchiveUser(string userid)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var userstore = DataContext.Store<User>();
                return userstore.Query
                                .Where(_user => _user.EntityId == userid)
                                .Where(_user => _user.Status != UserStatus.Archived)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find the non-archived user")
                                .UsingValue(_user =>
                                {
                                    _user.Status = UserStatus.Archived;
                                    userstore.Modify(_user, true);
                                });
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
                                      .Where(_user => _user.EntityId == targetUser)
                                      .Where(_user => _user.Status == UserStatus.Archived)
                                      .FirstOrDefault()
                                      .ThrowIfNull("could not find user")
                                      .UsingValue(_user =>
                                      {
                                          _user.Status = UserStatus.Active;
                                          userstore.Modify(_user, true);
                                      }))
                                      .ThrowIf(opr => !opr.Succeeded, opr => opr.GetException());
            });


        public Operation<IEnumerable<User>> Discover()
            => FeatureAccess.Guard(UserContext, () => new User[0].AsEnumerable());


        #region Biodata

        public Operation ModifyBioData(BioData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                var store = DataContext.Store<BioData>();
                data.OwnerId = _user.UserId;

                var persisted = store.Query
                    .Where(_ud => _ud.OwnerId == _user.EntityId)
                    .Where(_ud => _ud.EntityId == data.EntityId)
                    .FirstOrDefault();

                if (persisted != null)
                {
                    data.CopyTo(persisted, nameof(BioData.Owner));
                    store.Modify(persisted, true);
                }
                else store.Add(data).Context.CommitChanges();
            });

        public Operation<BioData> GetBioData()
            => FeatureAccess.Guard(UserContext, () => DataContext.Store<BioData>().Query.FirstOrDefault(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId));
        #endregion


        #region Contact data
        public Operation<long> AddContactData(ContactData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the biodata

                //persist the contact data
                DataContext.Store<ContactData>()
                    .Add(data).Context
                    .CommitChanges();

                return data.EntityId;
            });

        public Operation ModifyContactData(ContactData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                var store = DataContext.Store<ContactData>();

                var persisted = store.Query
                    .Where(_ud => _ud.OwnerId == _user.EntityId)
                    .Where(_ud => _ud.EntityId == data.EntityId)
                    .FirstOrDefault()
                    .ThrowIfNull("data not found");

                data.CopyTo(persisted, nameof(CorporateData));
                store.Modify(persisted, true);
            });

        public Operation<IEnumerable<ContactData>> GetContactData()
            => FeatureAccess.Guard(UserContext, () =>
            {
                return DataContext.Store<ContactData>().Query
                    .Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId)
                    .UsingEach(_ud => _ud.Owner = null);
            });

        public Operation RemoveContactData(long[] ids)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var contactStore = DataContext.Store<ContactData>();
                ids.Batch(200).ForAll((cnt, _batch) =>
                {
                    var nar = _batch.ToArray();
                    contactStore.Query
                                 .Where(_ => _.OwnerId == user.EntityId)
                                 .Where(_ => nar.Contains(_.EntityId))
                                 .Pipe(_ => contactStore.Delete(_.AsEnumerable()));
                });

                contactStore.Context.CommitChanges();
            });
        #endregion


        #region Corporate data
        public Operation<long> AddCorporateData(CorporateData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the biodata

                //persist the contact data
                DataContext.Store<CorporateData>()
                    .Add(data).Context
                    .CommitChanges();

                return data.EntityId;
            });

        public Operation ModifyCorporateData(CorporateData data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                var store = DataContext.Store<CorporateData>();

                var persisted = store.Query
                    .Where(_cd => _cd.OwnerId == _user.EntityId)
                    .Where(_cd => _cd.EntityId == data.EntityId)
                    .FirstOrDefault()
                    .ThrowIfNull("data not found");

                data.CopyTo(persisted, nameof(CorporateData.Owner));
                store.Modify(persisted, true);
            });

        public Operation<IEnumerable<CorporateData>> GetCorporateData()
            => FeatureAccess.Guard(UserContext, () =>
            {
                return DataContext.Store<CorporateData>().Query
                    .Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId)
                    .UsingEach(_ud => _ud.Owner = null);
            });

        public Operation RemoveCorporateData(long[] ids)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var corporateStore = DataContext.Store<CorporateData>();
                ids.Batch(200).ForAll((cnt, _batch) =>
                {
                    var nar = _batch.ToArray();
                    corporateStore.Query
                                 .Where(_ => _.OwnerId == user.EntityId)
                                 .Where(_ => nar.Contains(_.EntityId))
                                 .Pipe(_ => corporateStore.Delete(_.AsEnumerable()));
                });

                corporateStore.Context.CommitChanges();
            });
        #endregion


        #region User data
        public Operation<IEnumerable<long>> AddData(UserData[] data)
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
                                 .Where(_ud => _ud.OwnerId == user.EntityId && names.Contains(_ud.Name))
                                 .Pipe(_uds => existingData.AddRange(_uds));
                });

                //persist the difference
                data.Except(existingData, new DataNameComparer())
                    .UsingEach((_data) => _data.OwnerId = user.UserId)
                    .Do(_data => userdatastore.Add(_data).Context.CommitChanges());

                return data.Select(_d => _d.EntityId);
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
                                 .Where(_ud => _ud.OwnerId == user.EntityId)
                                 .Where(_ud => nar.Contains(_ud.Name))
                                 .Pipe(_uds => userdatastore.Delete(_uds.AsEnumerable()));
                });

                userdatastore.Context.CommitChanges();
            });

        public Operation<IEnumerable<UserData>> GetUserData()
            => FeatureAccess.Guard(UserContext, () =>
            {
                return DataContext.Store<UserData>().Query
                    .Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId)
                    .UsingEach(_ud => _ud.Owner = null);
            });

        public Operation<UserData> GetUserData(string name)
            => FeatureAccess.Guard(UserContext, () =>
            {
                return DataContext.Store<UserData>().Query
                    .Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId)
                    .Where(_ud => _ud.Name == name)
                    .FirstOrDefault()?
                    .UsingValue(_ud => _ud.Owner = null);
            });

        public Operation<string> UpdateProfileImage(EncodedBinaryData image, string oldImageUrl)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var url = BlobStore.Delete(oldImageUrl) //shouldnt fail even if oldImageUrl is null
                                   .Then(opr => BlobStore.Persist(image))
                                   .Resolve();

                //create the ProfileImage UserData and store the url
                var userData = DataContext.Store<UserData>().Query
                    .Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId)
                    .Where(_ud => _ud.Name == UserData_ProfileImage)
                    .FirstOrDefault() ??
                    new UserData
                    {
                        Name = UserData_ProfileImage,
                        OwnerId = UserContext.CurrentUser.EntityId,
                        Type = CommonDataType.Url
                    };

                userData.Data = url;

                if (userData.EntityId > 0) DataContext.Store<UserData>().Modify(userData, true);
                else DataContext.Store<UserData>().Add(userData).Context.CommitChanges();

                return url;
            });
        #endregion


        #region Farm Accounts
        public Operation<long> AddFarmAccount(Farm data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the biodata

                //persist the contact data
                DataContext.Store<Farm>()
                    .Add(data).Context
                    .CommitChanges();

                return data.EntityId;
            });

        public Operation ModifyFarmAccount(Farm data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                var store = DataContext.Store<Farm>();

                var persisted = store.Query
                    .Where(_ud => _ud.OwnerId == _user.EntityId)
                    .Where(_ud => _ud.EntityId == data.EntityId)
                    .FirstOrDefault()
                    .ThrowIfNull("data not found");

                data.CopyTo(persisted, nameof(Farm.Owner));
                store.Modify(persisted, true);
            });

        public Operation<IEnumerable<Farm>> GetFarmAccounts()
            => FeatureAccess.Guard(UserContext, () =>
            {
                return DataContext.Store<Farm>().Query
                    .Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId)
                    .UsingEach(_ud => _ud.Owner = null);
            });

        public Operation RemoveFarmAccount(long[] ids)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var contactStore = DataContext.Store<Farm>();
                ids.Batch(200).ForAll((cnt, _batch) =>
                {
                    var nar = _batch.ToArray();
                    contactStore.Query
                                .Where(_ => _.OwnerId == user.EntityId)
                                .Where(_ => nar.Contains(_.EntityId))
                                .Pipe(_ => contactStore.Delete(_.AsEnumerable()));
                });

                contactStore.Context.CommitChanges();
            });
        #endregion



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
