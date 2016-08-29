using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class ContextVerification: GaiaEntity<long>
    {
        public virtual User User
        {
            get { return get<User>(); }
            set { set(ref value); }
        }
        public virtual string UserId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string VerificationToken
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual bool Verified
        {
            get { return get<bool>(); }
            set { set(ref value); }
        }

        public virtual string Context
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual DateTime ExpiresOn
        {
            get { return get<DateTime>(); }
            set { set(ref value); }
        }
    }
}
