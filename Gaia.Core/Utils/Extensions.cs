using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Utils
{
    public static class Extensions
    {
        public static string GaiaDomainTypeName(this Type type) => $"Gaia.Domain.[{type.Name}]"; //i may have to add other checks later

        public static FeedEntry ToFeedEntry(this Post post) => new FeedEntry
        {
            Content = post.Message,
            CreatedOn = post.CreatedOn,
            EntryId = post.EntityId.ToString(),
            EntryType = typeof(Post).GaiaDomainTypeName(),
            Title = post.Title,
            ModifiedOn = post.ModifiedOn
        };

        public static PinnedFeedEntry ToPinnedFeedEntry(this Post post, PinnedFeed pin) => new PinnedFeedEntry
        {
            Content = post.Message,
            CreatedOn = post.CreatedOn,
            EntryId = post.EntityId.ToString(),
            EntryType = typeof(Post).GaiaDomainTypeName(),
            PinId = pin.EntityId,
            PinnedOn = pin.CreatedOn,
            Title = post.Title, 
            ModifiedOn = post.ModifiedOn
        };
    }
}
