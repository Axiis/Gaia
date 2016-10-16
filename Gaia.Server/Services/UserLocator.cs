using Gaia.Core.Services;
using Microsoft.Owin;
using System.Web;

namespace Gaia.Server.Services
{
    public class UserLocator : IUserLocator
    {
        private IOwinContext _owin = null;
        public UserLocator()
        {
            this._owin = HttpContext.Current.GetOwinContext();
        }


        public string CurrentUser() => _owin?.Authentication?.User?.Identity.Name;
    }
}