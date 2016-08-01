using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gaia.Server.OAuth
{
    public class OAuthPaths
    {
        readonly static public string ThirdpartyAuthorizationPath = "/AuthrizeThirdparty";
        readonly static public string TokenPath = "/Tokens";
    }
}