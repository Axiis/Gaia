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
                return notifstore.NewObject().With(new
                {
                    CreatedBy = user.UserId,
                    TargetUserId = user.UserId,
                    ContextId = contextId,
                    ContextType = contextName,
                    Title = title,
                    Message = message,
                    Status = NotificationStatus.Unseen
                })
                .UsingValue(_notif => notifstore.Add(_notif).Context.CommitChanges());
            });

        public Operation ClearNotification(long notificationId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                DataContext.Store<Notification>().Query
                           .Where(_notif => _notif.EntityId == notificationId)
                           .Where(_notif => _notif.TargetUserId == user.UserId)
                           .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                           .FirstOrDefault()
                           .PipeOrDefault(_notif => DataContext.Store<Notification>().Modify(_notif.With(new { Status = NotificationStatus.Seen }), true));
            });

        public Operation ClearAllNotifications()
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var notificationstore = DataContext.Store<Notification>();
                notificationstore.Query
                                 .Where(_notif => _notif.TargetUserId == user.UserId)
                                 .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                                 .ForAll((cnt, _notif) => notificationstore.Modify(_notif.With(new { Status = NotificationStatus.Seen }), false));

                notificationstore.Context.CommitChanges();
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
                    .Where(_notif => _notif.TargetUserId == user.UserId)
                    .Where(_notif => _notif.Status == NotificationStatus.Unseen)
                    .AsEnumerable();
            });
    }
}
