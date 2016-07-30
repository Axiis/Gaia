using Axis.Pollux.Identity.Principal;

namespace Gaia.Core.Domain
{
    public class Rating: GaiaEntity<long>
    {
        public virtual string ContextId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public virtual string ContextType
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

        public virtual int Score
        {
            get { return get<int>(); }
            set { set(ref value); }
        }
    }
}
