using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class ForumThread: GaiaEntity<long>
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

        public virtual string Title
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Description
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public long Topic
        {
            get { return get<long>(); }
            set { set(ref value); }
        }

        public ForumThreadStatus Status
        {
            get { return get<ForumThreadStatus>(); }
            set { set(ref value); }
        }
    }

    public enum ForumThreadStatus
    {
        Open,
        Closed,
        Flagged
    }
}
