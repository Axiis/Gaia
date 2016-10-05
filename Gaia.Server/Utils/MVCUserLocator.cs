using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gaia.Server.Utils
{
    public class MVCUserLocator : IUserLocator
    {
        private static readonly string UserSessionKey = "Gaia.Session.User";

        public string CurrentUser() => HttpContext.Current.Session[UserSessionKey]?.ToString();

        public void Signin(string userid) => HttpContext.Current.Session[UserSessionKey] = userid;

        public void Signout(string userId) => HttpContext.Current.Session.Remove(UserSessionKey);
    }
}