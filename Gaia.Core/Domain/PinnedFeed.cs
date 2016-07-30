using Axis.Pollux.Identity.Principal;

namespace Gaia.Core.Domain
{
    public class PinnedFeed: GaiaEntity<long>
    {
        public string ContextType
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public string ContextId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string OwnerId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }
    }
}
