using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface IActivityFeedService: IUserContextAware
    {
        /// <summary>
        /// Loads a specified number of feeds from the source in descending order, starting from the date specified.
        /// </summary>
        /// <param name="count">Number of feeds to load</param>
        /// <param name="from">date from which to load - a null value loads from the most recent</param>
        /// <returns></returns>
        [Feature("system/User/ActivityFeed/@load-past")]
        Operation<IEnumerable<FeedEntry>> LoadPastFeeds(int count, DateTime? from);

        /// <summary>
        /// Loads a specified number of feeds from the source in ascending order, starting from the date specified.
        /// </summary>
        /// <param name="count">Number of feeds to load</param>
        /// <param name="from">date from which to load</param>
        /// <returns></returns>
        [Feature("system/User/ActivityFeed/@load-recent")]
        Operation<IEnumerable<FeedEntry>> LoadRecentFeeds(int count, DateTime from);


        [Feature("system/User/ActivityFeed/@pin")]
        Operation<PinnedFeedEntry> PinEntry(long postId, string postType);

        [Feature("system/User/ActivityFeed/@unpin")]
        Operation<PinnedFeedEntry> UnpinEntry(long pinId);

        [Feature("system/User/ActivityFeed/@unpin-context")]
        Operation<PinnedFeedEntry> UnpinEntry(long pinContextId, string pinContextType);


        /// <summary>
        /// Loads a specified number of pinned feeds for the current user, from the source in descending order, starting from the date specified.
        /// </summary>
        /// <param name="count">Number of feeds to load</param>
        /// <param name="from">date from which to load - a null value loads from the most recent</param>
        /// <returns></returns>
        [Feature("system/User/ActivityFeed/@load-pinned")]
        Operation<IEnumerable<PinnedFeedEntry>> LoadPinnedFeeds(int count, DateTime? from);
    }
}
