using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Axis.Luna;

namespace Gaia.Server.Services
{
    public class UrlProvider: IAppUrlProvider
    {
        private IOwinContextProvider _owinProvider;

        public UrlProvider(IOwinContextProvider owinProvider)
        {
            _owinProvider = owinProvider;
        }

        public Operation<string> GetAccountVerificationUrl(string verificationToken, string targetUser)
        => Operation.Try(() =>
        {
            var ruri = _owinProvider.Owin.Request.Uri;
            var email = targetUser.Split('@');
            return new Uri($"{ruri.Scheme}://{ruri.Authority}/view-server/login/shell#/verify-registration/{verificationToken}/{email[0]}/{email[1]}").ToString();
        });

        public Operation<string> GetBlobUrl(string blobName)
        => Operation.Try(() =>
        {
            var ruri = _owinProvider.Owin.Request.Uri;
            return new Uri($"{ruri.Scheme}://{ruri.Authority}/Content/Blob/{blobName}").ToString();
        });
    }
}