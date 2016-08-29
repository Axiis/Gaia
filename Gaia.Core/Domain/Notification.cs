using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class Notification: GaiaEntity<long>
    {
        public string TargetUserId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public User TargetUser
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public string Title
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public string Message
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string ContextType
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public long ContextId
        {
            get { return get<long>(); }
            set { set(ref value); }
        }

        public NotificationStatus Status
        {
            get { return get<NotificationStatus>(); }
            set { set(ref value); }
        }        
    }

    public enum NotificationStatus
    {
        Seen,
        Unseen
    }
}
