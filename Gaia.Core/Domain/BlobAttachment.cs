using Axis.Luna;
using Axis.Pollux.Identity.Principal;
using System;

namespace Gaia.Core.Domain
{
    public class BlobAttachment: GaiaEntity<long>
    {
        public string BlobUri
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string Context
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public string ContextId
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


        public Uri ToUri() => new Uri(BlobUri);
    }
}