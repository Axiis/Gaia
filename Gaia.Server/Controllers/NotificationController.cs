using Gaia.Core.Services;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using System.Web.Http;

namespace Gaia.Server.Controllers
{
    public class NotificationController : ApiController
    {
        private INotificationService _notificationService = null;

        public NotificationController(INotificationService notificationService)
        {
            ThrowNullArguments(() => notificationService);

            this._notificationService = notificationService;
        }


        [HttpDelete]
        [Route("api/user-notifictions/@{notificationId}")]
        public IHttpActionResult ClearNotification(long notificationId)
            => _notificationService.ClearNotification(notificationId)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;

        [HttpDelete]
        [Route("api/user-notifications")]
        public IHttpActionResult ClearAllNotifications()
            => _notificationService.ClearAllNotifications()
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;


        [HttpGet]
        [Route("api/notifications/@{targetUser}")]
        public IHttpActionResult NotificationsFor(string targetUser)
            => _notificationService.NotificationsFor(targetUser)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;

        [HttpGet]
        [Route("api/xxx")]
        public IHttpActionResult Notifications()
            => _notificationService.Notifications()
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;
    }
}
