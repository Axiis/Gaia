using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Gaia.Core.Services;
using System;
using System.Web.Http;

namespace Gaia.Server.Controllers
{
    public class ContextVerificationController: ApiController
    {
        private IContextVerificationService _contextVeirification = null;

        public ContextVerificationController(IContextVerificationService contxtVerification)
        {
            ThrowNullArguments(() => contxtVerification);

            this._contextVeirification = contxtVerification;
        }

        [HttpPost]
        [Route("api/context-verification/@{userId}/@{verificationContext}")]
        public IHttpActionResult CreateVerificationObject(string userId, string verificationContext)
            => _contextVeirification.CreateVerificationObject(userId, verificationContext)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/context-verification/@{userId}/@{verificationContext}/@{expiryDate}")]
        public IHttpActionResult CreateVerificationObject(string userId, string verificationContext, DateTime expiryDate)
            => _contextVeirification.CreateVerificationObject(userId, verificationContext, expiryDate)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/context-verification/@{userId}/@{verificationContext}/@{token}")]
        public IHttpActionResult VerifyContext(string userId, string verificationContext, string token)
            => _contextVeirification.VerifyContext(userId, verificationContext, token)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
    }
}