using Microsoft.Owin;
using Owin;
using System.Runtime.Remoting.Messaging;

namespace Gaia.Server.Services
{
    public interface IOwinContextProvider
    {
        IOwinContext OwinContext { get; }
    }

    public class CallContextOwinProvider : IOwinContextProvider
    {
        internal static string OwinContextKey = "Gaia.OwinContext";
        public IOwinContext OwinContext => CallContext.LogicalGetData(OwinContextKey) as IOwinContext;
    }

    public static class CallContextOwinProviderExtension
    {
        public static IAppBuilder UseCallContextOwinProvider(this IAppBuilder app)
            => app?.Use(async (cxt, next) =>
            {
                CallContext.LogicalSetData(CallContextOwinProvider.OwinContextKey, cxt);
                await next();
            });
    }
}