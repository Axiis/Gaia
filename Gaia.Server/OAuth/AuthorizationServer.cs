using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Microsoft.Owin.Security.OAuth;
using System.Threading.Tasks;
using System.Security.Claims;
using Axis.Pollux.Authentication.Service;
using Axis.Pollux.Authentication;
using System.Text;
using Axis.Luna.Extensions;
using Axis.Jupiter;
using Axis.Pollux.Identity.Principal;
using System.Linq;
using Axis.Luna;
using Gaia.Core.Domain;

namespace Gaia.Server.OAuth
{
    public class AuthorizationServer : OAuthAuthorizationServerProvider//, IAuthenticationTokenProvider
    {
        private ICredentialAuthentication _credentialAuthority = null;
        private IDataContext _dataContext = null;

        public AuthorizationServer(ICredentialAuthentication credentialAuthority, IDataContext dataContext)
        {
            ThrowNullArguments(() => credentialAuthority, () => dataContext);

            this._credentialAuthority = credentialAuthority;
            this._dataContext = dataContext;
        }

        #region OAuthAuthrizationServerProvider
        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
            => Task.Run(() =>
            {
                Operation.Try(() =>
                {
                    _dataContext.Store<User>().Query
                        .Where(_u => _u.EntityId == context.UserName)
                        .FirstOrDefault()
                        .ThrowIfNull("invalid user credential")
                        .ThrowIf(_u => _u.Status != UserStatus.Active, "inactive user account");
                })

                //authenticate the credential authority
                .Then(opr => _credentialAuthority.VerifyCredential(new Credential
                {
                    OwnerId = context.UserName,
                    Metadata = CredentialMetadata.Password,
                    Value = Encoding.Unicode.GetBytes(context.Password)
                }))

                //aggregate the claims that makeup the token
                .Then(opr =>
                {
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                    identity.AddClaim(new Claim("user-name", context.UserName));
                    identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));

                    context.Validated(new Microsoft.Owin.Security.AuthenticationTicket(identity, null));
                })
                .Error(opr => context.UsingValue(cxt => cxt.SetError("invalid_grant", opr.Message))
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