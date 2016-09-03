using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;
using Axis.Pollux.Identity.Principal;

namespace Gaia.Core.Services
{
    public class AccessProfileService: BaseService, IAccessProfileService
    {
        public override IUserContextService UserContext { get; protected set; }
        public IDataContext DataContext { get; private set; }


        public AccessProfileService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<FeatureAccessProfile> CreateFeatureAccessProfile(string profileCode, string title)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var fapstore = DataContext.Store<FeatureAccessProfile>();
                return fapstore.NewObject().UsingValue(_fap =>
                {
                    _fap.Title = title.ThrowIf(_t => string.IsNullOrWhiteSpace(_t), "invalid title");
                    _fap.AccessCode = profileCode.ThrowIf(_t => string.IsNullOrWhiteSpace(_t), "invalid title"); //dont need to bother checking for existence, as this is unique in the db.
                    _fap.CreatedBy = UserContext.CurrentUser.UserId;
                    _fap.Status = FeatureAccessProfileStatus.Active;
                    fapstore.Add(_fap).Context.CommitChanges();
                });
            });

        public Operation<FeatureAccessProfile> ModifyFeatureAccessProfile(FeatureAccessProfile profile,
                                                                          string[] grantedDescriptors,
                                                                          string[] deniedDescriptors)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var fadstore = DataContext.Store<FeatureAccessDescriptor>();

                //first clear all previous descriptors
                fadstore.Query
                        .Where(_fad => _fad.AccessProfileCode == profile.AccessCode)
                        .ToArray() //<- will have to test if i can get away without using this
                        .Pipe(_fads => fadstore.Delete(_fads, false))
                        .Context.CommitChanges();

                //attach the new descriptors
                grantedDescriptors.Select(_g => fadstore.NewObject().UsingValue(_fap =>
                {
                    _fap.AccessDescriptor = _g;
                    _fap.AccessProfileCode = profile.AccessCode;
                    _fap.CreatedBy = UserContext.CurrentUser.UserId;
                    _fap.Permission = AccessPermission.Grant;
                }))
                .Union(deniedDescriptors.Select(_d => fadstore.NewObject().UsingValue(_fap =>
                {
                    _fap.AccessDescriptor = _d;
                    _fap.AccessProfileCode = profile.AccessCode;
                    _fap.CreatedBy = UserContext.CurrentUser.UserId;
                    _fap.Permission = AccessPermission.Deny;
                })))
                .Do(descriptors => fadstore.Add(descriptors).Context.CommitChanges());

                //modify the profile
                var fapstore = DataContext.Store<FeatureAccessProfile>();
                return fapstore.Query
                               .FirstOrDefault(_fap => _fap.AccessCode == profile.AccessCode)
                               .ThrowIfNull("could not find access profile")
                               .UsingValue(_fap =>
                               {
                                   _fap.Description = profile.Description;
                                   _fap.Title = profile.Title;
                                   fapstore.Modify(_fap, true);
                               });
            });

        public Operation ArchiveAccessProfile(long profileId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var fapstore = DataContext.Store<FeatureAccessProfile>();
                fapstore.Query
                        .FirstOrDefault(_fap => _fap.EntityId == profileId)
                        .ThrowIfNull("could not find access profile")
                        .Do(_fap =>
                        {
                            _fap.Status = FeatureAccessProfileStatus.Archived;
                            fapstore.Modify(_fap, true);
                        });
            });

        public Operation<UserAccessProfile> ApplyAccessProfile(string userId, string accessProfileCode, DateTime? expiryDate)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var uapstore = DataContext.Store<UserAccessProfile>();
                if (uapstore.Query.Any(_uap => _uap.OwnerId == userId && _uap.AccessProfileCode == accessProfileCode)
                   || !DataContext.Store<User>().Query.Any(_user => _user.EntityId == userId)
                   || !DataContext.Store<FeatureAccessProfile>().Query.Any(_fap => _fap.AccessCode == accessProfileCode))
                    throw new Exception("could not apply the access profile");

                else return uapstore.NewObject().UsingValue(_uap =>
                {
                    _uap.CreatedBy = UserContext.CurrentUser.UserId;
                    _uap.ExpiresOn = expiryDate.ThrowIf(ed => ed < DateTime.Now, "invalid expiry date");
                    _uap.AccessProfileCode = accessProfileCode;
                    _uap.OwnerId = userId;
                    _uap.UserCancelled = false;

                    uapstore.Add(_uap).Context.CommitChanges();
                });
            });

        public Operation<UserAccessProfile> RevokeAccessProfile(string userId, string accessProfileCode)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var uapstore = DataContext.Store<UserAccessProfile>();
                return uapstore.Query
                               .FirstOrDefault(_uap => _uap.OwnerId == userId && _uap.AccessProfileCode == accessProfileCode)
                               .ThrowIfNull("could not find access profile binding")
                               .UsingValue(_uap => uapstore.Delete(_uap, true));
            });

        public Operation<UserAccessProfile> MigrateAccessProfile(string userId, string oldAccessProfileCode, string newAccessProfileCode, DateTime? newExpiry)
            => FeatureAccess.Guard(UserContext, () =>
            {
                return this.RevokeAccessProfile(userId, oldAccessProfileCode)
                           .Then(opr => ApplyAccessProfile(userId, newAccessProfileCode, newExpiry));
            });

        public Operation<IEnumerable<UserAccessProfile>> ActiveUserAccessProfiles(string userId)
            => FeatureAccess.Guard(UserContext, () => DataContext.Store<UserAccessProfile>().Query
                                                                 .Where(_uap => _uap.OwnerId == userId)
                                                                 .AsEnumerable());
    }
}
