using Axis.Luna;
using Gaia.Core.System;
using System;

namespace Gaia.Core.Services
{
    public interface IBlobStoreService : IGaiaService, IUserContextAware
    {
        Operation<string> Persist(EncodedBinaryData blob);
        Operation Delete(string blobUri);
        Operation<EncodedBinaryData> GetBlob(string blobUri);
    }
}
