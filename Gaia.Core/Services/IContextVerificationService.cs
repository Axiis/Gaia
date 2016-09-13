using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;

namespace Gaia.Core.Services
{
    public interface IContextVerificationService : IGaiaService, IUserContextAware
    {
        [Feature("system/User/ContextVerification/@create-default")]
        Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext);

        [Feature("system/User/ContextVerification/@create")]
        Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext, DateTime expiryDate);

        [Feature("system/User/ContextVerification/@verify")]
        Operation VerifyContext(string userId, string verificationContext, string token);
    }
}
