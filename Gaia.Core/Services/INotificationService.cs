using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface INotificationService : IUserContextAware
    {
        [Feature("system/Notifications/@notify")]
        Operation<Notification> Notify(string targetUser, string title, string message, string contextName, long contextId);

        [Feature("system/User/Notification/@clear")]
        Operation ClearNotification(long notificationId);

        [Feature("system/User/Notification/@clear-all")]
        Operation ClearAllNotifications();

        [Feature("system/User/Notification/@get-target-notifications")]
        Operation<IEnumerable<Notification>> NotificationsFor(string targetUser);

        [Feature("system/User/Notification/@get-own-notifications")]
        Operation<IEnumerable<Notification>> Notifications();
    }
}
