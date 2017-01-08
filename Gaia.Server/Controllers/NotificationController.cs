using Gaia.Core.Services;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using System.Web.Http;

namespace Gaia.Server.Controllers
{
    [Authorize]
    public class NotificationController : ApiController
    {
        private INotificationService _notificationService = null;

        public NotificationController(INotificationService notificationService)
        {
            ThrowNullArguments(() => notificationService);

            this._notificationService = notificationService;
        }


        [HttpDelete]
        [Route("api/user-notifictions")]
        public IHttpActionResult ClearNotification([FromBody]NotificationModels.NotificationInfo info)
            => _notificationService.ClearNotification(info.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpDelete]
        [Route("api/user-notifications")]
        public IHttpActionResult ClearAllNotifications()
            => _notificationService.ClearAllNotifications()
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpGet]
        [Route("api/notifications")]
        public IHttpActionResult NotificationsFor([FromBody]NotificationModels.NotificationInfo info)
            => _notificationService.NotificationsFor(info.TargetUser)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpGet]
        [Route("api/user-notifications")]
        public IHttpActionResult Notifications()
            => _notificationService.Notifications()
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
    }

    namespace NotificationModels
    {
        public class NotificationInfo
        {
            public string TargetUser { get; set; }
            public long Id { get; set; }
        }
    }
}
