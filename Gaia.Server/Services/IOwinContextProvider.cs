using Microsoft.Owin;

namespace Gaia.Server.Services
{
    public interface IOwinContextProvider
    {
        IOwinContext Context { get;}
    }

    public class OwinContextProvider : IOwinContextProvider
    {
        public OwinContextProvider(IOwinContext context)
        {
            _context = context;
        }

        private IOwinContext _context;

        public IOwinContext Context => _context;
    }
}