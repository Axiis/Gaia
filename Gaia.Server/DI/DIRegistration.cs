using Gaia.Server.OAuth;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Security.OAuth;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gaia.Server.DI
{
    public static class DIRegistration
    {
        public static void RegisterTypes(Container c)
        {
            c.Register<AuthorizationServer>(Lifestyle.Singleton);
            c.Register<IOAuthAuthorizationServerProvider>(() => c.GetInstance<AuthorizationServer>());
            c.Register<IAuthenticationTokenProvider>(() => c.GetInstance<AuthorizationServer>());


            #region infrastructure service registration

            c.Register<TokenStore>(Lifestyle.Singleton);

            #endregion

            #region domain service registration
            #endregion

            #region webapi controller registration
            #endregion

        }
    }
}