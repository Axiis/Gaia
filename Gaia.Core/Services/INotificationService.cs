using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;

namespace Gaia.Core.Services
{
    public interface INotificationService : IUserContextAware
    {
        [Feature("system/Notifications/@notify")]
        Operation<Notification> Notify(string targetUser, string title, string message, string contextName, string contextId);

        [Feature("system/User/Notification/@clear")]
        Operation ClearNotification(long notificationId);

        [Feature("system/User/Notification/@clear-all")]
        Operation ClearAllNotifications();
    }
}
