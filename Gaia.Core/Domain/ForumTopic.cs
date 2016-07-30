using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class ForumTopic: GaiaEntity<long>
    {
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

        public virtual ForumTopicStatus Status
        {
            get { return get<ForumTopicStatus>(); }
            set { set(ref value); }
        }
    }

    public enum ForumTopicStatus
    {
        Open,
        Closed,
        Flagged
    }
}
