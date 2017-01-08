using Axis.Jupiter;
using Gaia.Core.Domain;
using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using static Axis.Luna.Extensions.ExceptionExtensions;

namespace Gaia.Server.Utils
{
    public class MVCUserLocator : IUserLocator
    {
        private static readonly string UserSessionKey = "Gaia.Session.User";
        private static readonly string AccessProfilesSessionKey = "Gaia.Session.AccessProfiles";

        public string CurrentUser() => HttpContext.Current.Session[UserSessionKey]?.ToString();
        public string[] UserAccessProfiles()
        {
            var user = CurrentUser();
            return _context.Store<UserAccessProfile>().Query
                .Where(_uap => _uap.OwnerId == user)
                .Select(_uap => _uap.AccessProfileCode)
                .ToArray();
        }

        public void Signin(string userid)
        {
            HttpContext.Current.Session[UserSessionKey] = userid;

        }

        public void Signout(string userId)
        {
            HttpContext.Current.Session.Remove(UserSessionKey);
        }


        private IDataContext _context = null;
        public MVCUserLocator(IDataContext context)
        {
            ThrowNullArguments(() => context);

            this._context = context;
        }
    }
}