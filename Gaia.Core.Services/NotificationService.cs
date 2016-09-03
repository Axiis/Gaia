using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;

namespace Gaia.Core.Services
{
    public class NotificationService: INotificationService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }


        public NotificationService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<Notification> Notify(string targetUser, string title, string message, string contextName, long contextId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var notifstore = DataContext.Store<Notification>();
                return notifstore.NewObject().UsingValue(_notif =>
                {
                    _notif.CreatedBy = user.UserId;
                    _notif.TargetUserId = user.UserId;
                    _notif.ContextId = contextId;
                    _notif.ContextType = contextName;
                    _notif.Title = title;
                    _notif.Message = message;
                    _notif.Status = NotificationStatus.Unseen;

                    notifstore.Add(_notif).Context.CommitChanges();
                });
            });

        public Operation ClearNotification(long notificationId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                DataContext.Store<Notification>().Query
                           .Where(_notif => _notif.EntityId == notificationId)
                           .Where(_notif => _notif.TargetUserId == user.EntityId)
                           .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                           .FirstOrDefault()
                           .PipeOrDefault(_notif =>
                           {
                               _notif.Status = NotificationStatus.Seen;
                               DataContext.Store<Notification>().Modify(_notif, true);
                           });
            });

        public Operation ClearAllNotifications()
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var notificationstore = DataContext.Store<Notification>();
                notificationstore.Query
                    .Where(_notif => _notif.TargetUserId == user.EntityId)
                    .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                    .UsingEach(_notif => { _notif.Status = NotificationStatus.Seen; })
                    .Do(_notifs => notificationstore.Modify(_notifs, true));
            });


        public Operation<IEnumerable<Notification>> NotificationsFor(string targetUser)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var notificationStore = DataContext.Store<Notification>();
                return notificationStore.Query
                    .Where(_notif => _notif.TargetUserId == targetUser)
                    .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                    .AsEnumerable();
            });

        public Operation<IEnumerable<Notification>> Notifications()
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var notificationstore = DataContext.Store<Notification>();
                return notificationstore.Query
                    .Where(_notif => _notif.TargetUserId == user.EntityId)
                    .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                    .AsEnumerable();
            });
    }
}
