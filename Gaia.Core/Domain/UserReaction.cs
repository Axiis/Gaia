using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class UserReaction: GaiaEntity<long>
    {
        public virtual string OwnerId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public virtual User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public virtual long ContextId
        {
            get { return get<long>(); }
            set { set(ref value); }
        }
        public virtual string ContextType
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Reaction
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
    }
}
