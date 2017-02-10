using Microsoft.Owin;
using Owin;
using System.Runtime.Remoting.Messaging;

namespace Gaia.Server.Services
{
    public interface IOwinContextProvider
    {
        IOwinContext Owin { get; }
    }

    public class OwinContextProvider: IOwinContextProvider
    {
        public virtual IOwinContext Owin => CallContext.LogicalGetData(OwinContextProviderExtension.CallContextOwinKey) as IOwinContext;
    }

    public static class OwinContextProviderExtension
    {
        public static readonly string CallContextOwinKey = "Gaia.CallContext.OwinContext";

        public static IAppBuilder UseOwinContextProvider(this IAppBuilder app)
            => app.Use(async (context, next) =>
            {
                CallContext.LogicalSetData(CallContextOwinKey, context);
                await next();
            });
    }
}