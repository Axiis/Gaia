using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class FeedEntry
    {
        public string EntryType { get; set; }
        public string EntryId { get; set; }

        public string Title { get; set; }
        public string Content { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }

        /// <summary>
        /// In case there are data specific to certain types of feed-entries that need to be carried along to the UI, they can be attached here,
        /// and will be serialized. It is left for the client to decide how to use what it finds in here.
        /// </summary>
        public object Metadata { get; set; }
    }

    public class PinnedFeedEntry: FeedEntry
    {
        public long PinId { get; set; }
        public DateTime PinnedOn { get; set; }
    }
}
