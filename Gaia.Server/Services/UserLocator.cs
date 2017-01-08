using Gaia.Core.Services;
using Microsoft.Owin;
using System.Web;
using System;
using Axis.Jupiter;
using Gaia.Core.Domain;
using System.Linq;

namespace Gaia.Server.Services
{
    public class UserLocator : IUserLocator
    {
        private IOwinContext _owin = null;
        private IDataContext _context = null;
        public UserLocator(IDataContext context)
        {
            this._owin = HttpContext.Current.GetOwinContext();
            this._context = context;
        }


        public string CurrentUser() => _owin?.Authentication?.User?.Identity.Name;

        public string[] UserAccessProfiles()
        {
            var user = CurrentUser();
            return _context.Store<UserAccessProfile>().Query
                .Where(_uap => _uap.OwnerId == user)
                .Select(_uap => _uap.AccessProfileCode)
                .ToArray();
        }
    }
}