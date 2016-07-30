using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class Comment: GaiaEntity<long>
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

        public string Text
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
    }
}
