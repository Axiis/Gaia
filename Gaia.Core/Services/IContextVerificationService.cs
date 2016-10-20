using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;

namespace Gaia.Core.Services
{
    public interface IContextVerificationService : IGaiaService, IUserContextAware
    {
        [Feature("system/ContextVerifications/@create-default")]
        Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext);

        [Feature("system/ContextVerifications/@create")]
        Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext, DateTime expiryDate);

        [Feature("system/ContextVerifications/@verify")]
        Operation VerifyContext(string userId, string verificationContext, string token);
    }
}
