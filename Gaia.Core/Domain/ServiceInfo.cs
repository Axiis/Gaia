using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain.Meta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class ServiceInfo: GaiaEntity<long>
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

        public virtual string ServiceName
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Description
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string VideoLinks
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string PhotoLinks
        {
            get { return get<string>(); }
            set { set(ref value); }
        }


        public virtual ServiceCategory Category
        {
            get { return get<ServiceCategory>(); }
            set { set(ref value); }
        }
    }
}
