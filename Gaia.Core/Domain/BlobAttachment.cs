using Axis.Luna;
using Axis.Pollux.Identity.Principal;
using System;

namespace Gaia.Core.Domain
{
    public class BlobAttachment: GaiaEntity<long>
    {
        public string BlobId { get; set; }

        public string Context
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public long ContextId
        {
            get { return get<long>(); }
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


        public Uri BlobUri() => new Uri(BlobId);
    }
}