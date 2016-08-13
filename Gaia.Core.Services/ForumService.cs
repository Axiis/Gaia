using Axis.Luna.Extensions;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;
using System;

namespace Gaia.Core.Services
{
    public class ForumService : IForumService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }

        public ForumService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<ForumThread> CreateThread(string title, long topicId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var threadstore = DataContext.Store<ForumThread>();
                if (!DataContext.Store<ForumTopic>().Query.Any(topic => topic.EntityId == topicId)) throw new Exception("could not find topic");
                return threadstore.NewObject().With(new
                {
                    Title = title,
                    CreatedBy = user.UserId,
                    OwnerId = user.UserId,
                    Topic = topicId
                })
                .UsingValue(_thread => threadstore.Add(_thread).Context.CommitChanges());
            });

        public Operation<ForumTopic> CreateTopic(string title)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var topicstore = DataContext.Store<ForumTopic>();
                return topicstore.NewObject().With(new
                {
                    Title = title,
                    CreatedBy = user.UserId
                })
                .UsingValue(_topic => topicstore.Add(_topic).Context.CommitChanges());
            });

        public Operation<ForumThread> ModifyThread(ForumThread thread)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var threadstore = DataContext.Store<ForumThread>();
                return threadstore.Query
                                  .Where(_thread => _thread.EntityId == thread.EntityId)
                                  .Where(_thread => _thread.Status == ForumThreadStatus.Open)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find Thread")
                                  .UsingValue(_thread =>
                                  {
                                      _thread.Title = thread.Title;
                                      _thread.Content = thread.Content;
                                      threadstore.Modify(_thread, true);
                                  });
            });

        public Operation<ForumTopic> ModifyTopic(ForumTopic topic)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var topicstore = DataContext.Store<ForumTopic>();
                return topicstore.Query
                                 .Where(_topic => _topic.EntityId == topic.EntityId)
                                 .FirstOrDefault()
                                 .ThrowIfNull("could not find Forum topic")
                                 .UsingValue(_topic =>
                                 {
                                     _topic.Title = topic.Title;
                                     _topic.Description = topic.Description;
                                     topicstore.Modify(_topic, true);
                                 });
            });

        /// <summary>
        /// only an admin should be able to flag a thread so that it cant be seen any more
        /// </summary>
        /// <param name="threadId"></param>
        /// <returns></returns>
        public Operation<ForumThread> FlagThread(long threadId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var threadstore = DataContext.Store<ForumThread>();
                return threadstore.Query
                                  .Where(_thread => _thread.EntityId == threadId)
                                  .Where(_thread => _thread.Status != ForumThreadStatus.Flagged)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find Thread")
                                  .UsingValue(_thread =>
                                  {
                                      _thread.Status = ForumThreadStatus.Flagged;
                                      threadstore.Modify(_thread, true);
                                  });
            });

        public Operation<ForumTopic> FlagTopic(long topicId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var topicstore = DataContext.Store<ForumTopic>();
                return topicstore.Query
                                  .Where(_topic => _topic.EntityId == topicId)
                                  .Where(_topic => _topic.Status != ForumTopicStatus.Flagged)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find Thread")
                                  .UsingValue(_topic =>
                                  {
                                      _topic.Status = ForumTopicStatus.Flagged;
                                      topicstore.Modify(_topic, true);
                                  });
            });

        public Operation<ForumThreadWatch> WatchThread(long threadId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (!DataContext.Store<ForumThread>().Query
                                .Where(_thread => _thread.EntityId == threadId)
                                .Where(_thread => _thread.Status == ForumThreadStatus.Open)
                                .Any()) throw new Exception("could not find Forum thread");

                var user = UserContext.CurrentUser;
                var watchstore = DataContext.Store<ForumThreadWatch>();
                return watchstore.Query
                                 .Where(_watch => _watch.ThreadId == threadId)
                                 .Where(_watch => _watch.OwnerId == user.UserId)
                                 .FirstOrDefault() ??
                                 watchstore.NewObject().With(new
                                 {
                                     CreatedBy = user.UserId,
                                     OwnerId = user.UserId,
                                     ThreadId = threadId
                                 })
                                 .UsingValue(_watch => watchstore.Add(_watch).Context.CommitChanges());
            });
    }
}
