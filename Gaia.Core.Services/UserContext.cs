using System;
using System.Collections.Generic;
using System.Linq;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;
using Axis.Jupiter;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna.Extensions;

namespace Gaia.Core.Services
{
    public class UserContext : IUserContextService
    {
        private IDataContext _context = null;

        public UserContext(IDataContext dataStore, IUserLocator locator)
        {
            ThrowNullArguments(() => dataStore, () => locator);

            this._context = dataStore;
            this.Locator = locator;
        }

        public IUserLocator Locator { get; set; }

        private User _user = null;
        public User CurrentUser
        {
            get
            {
                return _user ?? (_user = Locator?.CurrentUser().Pipe(_uid => _context.Store<User>().Query.FirstOrDefault(_user => _user.EntityId == _uid)));
            }
            set { _user = value; }
        }

        public IEnumerable<FeatureAccessProfile> UserAccessProfiles()
            => CurrentUser.UserId.Pipe(uid =>
            {
                return from uap in _context.Store<UserAccessProfile>().Query
                       join fap in _context.Store<FeatureAccessProfile>().Query
                       on uap.AccessProfileCode equals fap.AccessCode
                       where uap.OwnerId == uid
                       select fap;
            })
            .ToArray();
    }
}
