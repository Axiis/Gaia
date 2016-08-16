using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;

namespace Gaia.Core.Services
{
    public class ActivityFeedService : IActivityFeedService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }


        public ActivityFeedService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<IEnumerable<FeedEntry>> LoadPastFeeds(int count, DateTime? from)
            => FeatureAccess.Guard(UserContext, () =>
            {
                count = count < 0 ? Math.Abs(count) : count;
                var _from = from ?? DateTime.Now;
                //for now, only the Policy-admin users can make posts that are targeted to everyone, so those are the posts that get viewed here
                return DataContext.Store<Post>().Query
                                  .Where(p => p.CreatedOn < _from)
                                  .Where(p => p.Status == PostStatus.Published)
                                  .Where(p => p.ParentPostId == 0) //<- most recent 'edit' of the post
                                  .OrderByDescending(p => p.CreatedOn)
                                  .Take(count)
                                  .ToArray()
                                  .Select(p => p.ToFeedEntry());
            });

        public Operation<IEnumerable<PinnedFeedEntry>> LoadPinnedFeeds(int count, DateTime? from)
            => FeatureAccess.Guard(UserContext, () =>
            {
                count = count < 0 ? Math.Abs(count) : count;
                var _from = from ?? DateTime.Now;

                var postStore = DataContext.Store<Post>().Query;
                var pinnedStore = DataContext.Store<PinnedFeed>().Query;
                var postDomainType = typeof(Post).GaiaDomainTypeName();
                var user = UserContext.CurrentUser;

                var q = from post in postStore
                        join pin in pinnedStore on post.EntityId equals pin.ContextId
                        where pin.ContextType == postDomainType && pin.CreatedOn < _from && pin.OwnerId == user.UserId
                        select new { pin, post };

                return q.Take(count).ToArray().Select(v => v.post.ToPinnedFeedEntry(v.pin));
            });

        public Operation<IEnumerable<FeedEntry>> LoadRecentFeeds(int count, DateTime from)
            => FeatureAccess.Guard(UserContext, () =>
            {
                count = count < 0 ? Math.Abs(count) : count;
                var postDomainType = typeof(Post).GaiaDomainTypeName();

                //for now, only the Policy-admin users can make posts that are targeted to everyone, so those are the posts that get viewed here
                return DataContext.Store<Post>().Query
                                  .Where(p => p.CreatedOn > from)
                                  .OrderByDescending(p => p.CreatedOn)
                                  .Take(count)
                                  .ToArray()
                                  .Select(p => p.ToFeedEntry());
            });

        public Operation<PinnedFeedEntry> PinEntry(long postId, string postType)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (postType == typeof(Post).GaiaDomainTypeName())
                {
                    var pinStore = DataContext.Store<PinnedFeed>();
                    var postStore = DataContext.Store<Post>();
                    var user = UserContext.CurrentUser;

                    var post = postStore.Query.FirstOrDefault(_post => _post.EntityId == postId);
                    var pin = pinStore.Query.FirstOrDefault(_pin => _pin.ContextId == postId && _pin.OwnerId == user.UserId) ??
                              pinStore.NewObject().With(new
                              {
                                  ContextId = post.ThrowIfNull("post not found").ToString(),
                                  ContextType = postType,
                                  CreatedOn = DateTime.Now,
                                  CreatedBy = UserContext.CurrentUser.UserId,
                                  Owner = UserContext.CurrentUser
                              });

                    if (pin.EntityId > 0 || pinStore.Add(pin).Context.CommitChanges() > 0) return post.ToPinnedFeedEntry(pin);
                    else throw new Exception("post not found");
                }
                else throw new Exception("unknown post type");
            });

        public Operation<PinnedFeedEntry> UnpinEntry(long pinId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var pin = DataContext.Store<PinnedFeed>().Query
                                     .FirstOrDefault(_pin => _pin.EntityId == pinId && _pin.OwnerId == user.UserId)
                                     .ThrowIfNull("pin not found");
                DataContext.Store<PinnedFeed>().Delete(pin);

                if (pin.ContextType == typeof(Post).GaiaDomainTypeName())
                    return DataContext.Store<Post>().Query
                                      .FirstOrDefault(_post => _post.EntityId == pin.ContextId)
                                      .ThrowIfNull("post not found")
                                      .ToPinnedFeedEntry(pin);

                else throw new Exception("unknown post type");
            });

        public Operation<PinnedFeedEntry> UnpinEntry(long contextId, string contextType)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (contextType == typeof(Post).GaiaDomainTypeName())
                {
                    var postId = contextId;
                    var post = DataContext.Store<Post>().Query
                                          .FirstOrDefault(_post => _post.EntityId == postId)
                                          .ThrowIfNull("post not found");

                    var user = UserContext.CurrentUser;
                    var pin = DataContext.Store<PinnedFeed>().Query
                                         .FirstOrDefault(_pin => _pin.ContextId == contextId && _pin.ContextType == contextType && _pin.OwnerId == user.UserId)
                                         .ThrowIfNull("pin not found");

                    DataContext.Store<PinnedFeed>().Delete(pin, true);
                    return post.ToPinnedFeedEntry(pin);
                }
                else throw new Exception("unknown post type");
            });
    }
}
