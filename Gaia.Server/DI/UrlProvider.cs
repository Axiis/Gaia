using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Axis.Luna;
using Gaia.Server.Services;

namespace Gaia.Server.DI
{
    public class UrlProvider : IAppUrlProvider
    {
        private IOwinContextProvider _owinProvider;

        public UrlProvider(IOwinContextProvider owin)
        {
            _owinProvider = owin;
        }

        public Operation<string> GetAccountVerificationUrl(string verificationToken)
        {
            throw new NotImplementedException();
        }
    }
}