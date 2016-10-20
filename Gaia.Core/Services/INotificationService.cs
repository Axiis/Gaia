using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface INotificationService : IGaiaService, IUserContextAware
    {
        [Feature("system/Notifications/@notify")]
        Operation<Notification> Notify(string targetUser, string title, string message, string contextName, long contextId);

        [Feature("system/Notifications/@clear")]
        Operation ClearNotification(long notificationId);

        [Feature("system/Notifications/@clear-all")]
        Operation ClearAllNotifications();

        [Feature("system/Notifications/@get-target-notifications")]
        Operation<IEnumerable<Notification>> NotificationsFor(string targetUser);

        [Feature("system/Notifications/@get-own-notifications")]
        Operation<IEnumerable<Notification>> Notifications();
    }
}
