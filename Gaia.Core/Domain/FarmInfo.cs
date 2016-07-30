using Axis.Pollux.Identity.Principal;

namespace Gaia.Core.Domain
{
    public class FarmInfo: GaiaEntity<long>
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

        public virtual string BusinessName
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// This should probably be a comma separated list of a known category of farm-produces.
        /// </summary>
        public virtual string Produce
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Address
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string GpsAreaPoints
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
    }
}
