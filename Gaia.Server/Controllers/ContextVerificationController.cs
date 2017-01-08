using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Gaia.Core.Services;
using System;
using System.Web.Http;
using Gaia.Server.Controllers.ContextVerificationModels;

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
        [Route("api/context-verification")]
        public IHttpActionResult CreateVerificationObject([FromBody]VerificationInfo info)
            => _contextVeirification.CreateVerificationObject(info.UserId, info.VerificationContext, info.ExpiryDate)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/context-verification")]
        public IHttpActionResult VerifyContext([FromBody]VerificationInfo info)
            => _contextVeirification.VerifyContext(info.UserId, info.VerificationContext, info.Token)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
    }

    namespace ContextVerificationModels
    {
        public class VerificationInfo
        {
            public string UserId { get; set; }
            public string VerificationContext { get; set; }
            public string Token { get; set; }
            public DateTime? ExpiryDate { get; set; }
        }
    }
}