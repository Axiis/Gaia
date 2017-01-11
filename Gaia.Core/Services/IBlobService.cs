using Axis.Luna;
using Gaia.Core.System;
using System;

namespace Gaia.Core.Services
{
    public interface IBlobStoreService : IGaiaService, IUserContextAware
    {
        Operation<Uri> Persist(EncodedBinaryData blob);
        Operation Delete(Uri blobUri);
        Operation<EncodedBinaryData> GetBlob(Uri blobUri);
    }
}
