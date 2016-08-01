using Microsoft.Owin.Security.Infrastructure;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace Gaia.Server.OAuth
{
    public class AuthorizationServer : OAuthAuthorizationServerProvider, IAuthenticationTokenProvider
    {
        private TokenStore _tokenStore = null;

        public AuthorizationServer(TokenStore tokenStore)
        {
            ThrowNullArguments(() => tokenStore);

            this._tokenStore = tokenStore;
        }

        #region OAuthAuthrizationServerProvider
        #endregion

        #region IAuthenticationTokenProvider Members
        public void Create(AuthenticationTokenCreateContext context)
        {
            throw new NotImplementedException();
        }

        public Task CreateAsync(AuthenticationTokenCreateContext context) => Task.Run(() => Create(context));

        public void Receive(AuthenticationTokenReceiveContext context)
        {
            throw new NotImplementedException();
        }

        public Task ReceiveAsync(AuthenticationTokenReceiveContext context) => Task.Run(() => Receive(context));
        #endregion
    }
}