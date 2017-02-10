using Axis.Luna;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Services
{
    public interface IAppUrlProvider
    {
        Operation<string> GetAccountVerificationUrl(string verificationToken, string targetUser);
        Operation<string> GetBlobUrl(string blobName);
    }
}
