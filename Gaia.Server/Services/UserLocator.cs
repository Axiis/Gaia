using Gaia.Core.Services;
using Axis.Jupiter;
using Gaia.Core.Domain;
using System.Linq;

namespace Gaia.Server.Services
{
    public class UserLocator : IUserLocator
    {
        private IDataContext _dataContext = null;
        private IOwinContextProvider _contextProvider = null;
        public UserLocator(IDataContext dataContext, IOwinContextProvider provider)
        {
            _dataContext = dataContext;
            _contextProvider = provider;
        }


        public string CurrentUser() => (_contextProvider.Context)?.Authentication?.User?.Identity.Name;

        public string[] UserAccessProfiles()
        {
            var user = CurrentUser();
            return _dataContext.Store<UserAccessProfile>().Query
                .Where(_uap => _uap.OwnerId == user)
                .Select(_uap => _uap.AccessProfileCode)
                .ToArray();
        }
    }
}