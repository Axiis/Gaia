using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface IActivityFeedService : IGaiaService, IUserContextAware
    {
        /// <summary>
        /// Loads a specified number of feeds from the source in descending order, starting from the date specified.
        /// </summary>
        /// <param name="count">Number of feeds to load</param>
        /// <param name="from">date from which to load - a null value loads from the most recent</param>
        /// <returns></returns>
        [Feature("system/ActivityFeeds/@load-past")]
        Operation<IEnumerable<FeedEntry>> LoadPastFeeds(int count, DateTime? from);

        /// <summary>
        /// Loads a specified number of feeds from the source in ascending order, starting from the date specified.
        /// </summary>
        /// <param name="count">Number of feeds to load</param>
        /// <param name="from">date from which to load</param>
        /// <returns></returns>
        [Feature("system/ActivityFeeds/@load-recent")]
        Operation<IEnumerable<FeedEntry>> LoadRecentFeeds(int count, DateTime from);


        [Feature("system/ActivityFeeds/@pin")]
        Operation<PinnedFeedEntry> PinEntry(long postId, string postType);

        [Feature("system/ActivityFeeds/@unpin")]
        Operation<PinnedFeedEntry> UnpinEntry(long pinId);

        [Feature("system/ActivityFeeds/@unpin-context")]
        Operation<PinnedFeedEntry> UnpinEntry(long pinContextId, string pinContextType);


        /// <summary>
        /// Loads a specified number of pinned feeds for the current user, from the source in descending order, starting from the date specified.
        /// </summary>
        /// <param name="count">Number of feeds to load</param>
        /// <param name="from">date from which to load - a null value loads from the most recent</param>
        /// <returns></returns>
        [Feature("system/ActivityFeeds/@load-pinned")]
        Operation<IEnumerable<PinnedFeedEntry>> LoadPinnedFeeds(int count, DateTime? from);
    }
}
