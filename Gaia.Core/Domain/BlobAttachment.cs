using Axis.Luna;

namespace Gaia.Core.Domain
{
    public class BlobAttachment: GaiaEntity<long>
    {
        public string BlobId { get; set; }

        public string Context { get; set; }
        public long ContextId { get; set; }
    }
}