using Axis.Luna;
using Gaia.Core.System;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    using Metadata = Dictionary<string, string>;

    public interface IBlobStoreService : IGaiaService, IUserContextAware
    {
        Operation<string> Persist(EncodedBinaryData blob);
        Operation Delete(string blobUri);
        Operation<EncodedBinaryData> GetBlob(string blobUri);

        Operation<Metadata> GetMetadata(string blobUri);
    }
}
