using System;
using System.Collections.Generic;
using System.Linq;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;
using Axis.Jupiter;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna.Extensions;
using System.Collections.Concurrent;

namespace Gaia.Core.Services
{
    public class UserContext : IUserContextService
    {
        private static ConcurrentDictionary<string, User> StaticUsers = new ConcurrentDictionary<string, User>();

        private IDataContext _context = null;
        private User _user = null;

        public IUserLocator Locator { get; set; }


        public UserContext(IDataContext dataStore, IUserLocator locator)
        {
            ThrowNullArguments(() => dataStore, () => locator);

            this._context = dataStore;
            this.Locator = locator;
        }

        public User CurrentUser
        {
            get
            {
                if (_user == null) 
                {
                    _user = Locator?.CurrentUser().Pipe(_uid => _context.Store<User>().Query.FirstOrDefault(_user => _user.EntityId == _uid)) ??
                            StaticUsers.GetOrAdd(DomainConstants.GuestAccount, _guid => _context.Store<User>().Query.FirstOrDefault(_u => _u.EntityId == _guid));
                }

                return _user;
            }
            set { _user = value; }
        }

        public IEnumerable<FeatureAccessProfile> UserAccessProfiles()
            => CurrentUser?.UserId.Pipe(uid =>
            {
                //Consider caching this list against IDs.
                //the cache can be cleared whenever the user owning the ID is assigned new AccessProfiles.
                return (from uap in _context.Store<UserAccessProfile>().Query
                       join fap in _context.Store<FeatureAccessProfile>().Query
                       on uap.AccessProfileCode equals fap.AccessCode
                       where uap.OwnerId == uid
                       select fap)
                       //.ToList() //<-- why did i ToList it??
                       .UsingEach(_fap =>
                       {
                           _context.Store<FeatureAccessDescriptor>().Query
                               .Where(_fad => _fad.AccessProfileCode == _fap.AccessCode)
                               .Pipe(_fads => _fap.AccessDescriptors.AddRange(_fads));
                       });
            })
            ?.ToArray()
            ?? new FeatureAccessProfile[0];
    }
}
