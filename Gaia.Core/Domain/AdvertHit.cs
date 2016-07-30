using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class AdvertHit: GaiaEntity<long>
    {
        public int HitCount
        {
            get { return get<int>(); }
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

        public long AdvertId
        {
            get { return get<long>(); }
            set { set(ref value); }
        }
        public Advert Advert
        {
            get { return get<Advert>(); }
            set { set(ref value); }
        }
    }
}
