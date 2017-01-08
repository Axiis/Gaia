using Axis.Luna;
using System;

namespace Gaia.Core.Services
{
    public interface IBlobService : IGaiaService, IUserContextService
    {
        Operation<Uri> Persist(EncodedBinaryData blob);
        Operation Delete(Uri blobUri);
        Operation<EncodedBinaryData> GetBlob(Uri blobUri);
    }
}
