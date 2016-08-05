using Microsoft.Owin.Security.Infrastructure;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Axis.Jupiter;
using System.Security.Claims;
using Axis.Pollux.Authentication.Service;
using Axis.Pollux.Authentication;
using System.Text;
using Axis.Luna.Extensions;

namespace Gaia.Server.OAuth
{
    public class AuthorizationServer : OAuthAuthorizationServerProvider//, IAuthenticationTokenProvider
    {
        private ICredentialAuthentication _credentialAuthority = null;

        public AuthorizationServer(ICredentialAuthentication credentialAuthority)
        {
            ThrowNullArguments(() => credentialAuthority);

            this._credentialAuthority = credentialAuthority;
        }

        #region OAuthAuthrizationServerProvider
        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
            => Task.Run(() =>
            {
                //authenticate the credential authority
                _credentialAuthority.VerifyCredential(new Credential
                {
                    OwnerId = context.UserName,
                    Metadata = CredentialMetadata.Password,
                    Value = Encoding.Unicode.GetBytes(context.Password)
                })
                .Then(opr => context.Validated(new ClaimsIdentity(context.Options.AuthenticationType).UsingValue(id => id.AddClaim(new Claim("user-name", context.UserName)))))
                .Error(() => context.UsingValue(cxt => cxt.SetError("invalid_grant","invalid user credential"))
                                    .UsingValue(cxt => cxt.Rejected()));
            });

        /// <summary>
        /// For custom authentication/authorizations
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task GrantCustomExtension(OAuthGrantCustomExtensionContext context) => base.GrantCustomExtension(context);
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context) => Task.Run(() => context.Validated());
        #endregion
    }
}