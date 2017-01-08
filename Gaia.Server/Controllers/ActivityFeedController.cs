using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna.Extensions;

using Gaia.Core.Services;
using Gaia.Server.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Gaia.Server.Controllers.ActivityFeedModels;

namespace Gaia.Server.Controllers
{
    public class ActivityFeedController : ApiController
    {
        private IActivityFeedService _activityFeed = null;

        public ActivityFeedController(IActivityFeedService activityFeedService)
        {
            ThrowNullArguments(() => activityFeedService);

            this._activityFeed = activityFeedService;
        }


        [HttpGet]
        [Route("api/activity-feeds")]
        public IHttpActionResult LoadPastFeeds([FromBody] LoadEntryInfo info)
            => _activityFeed.LoadPastFeeds(info.Count, info.From)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpGet]
        [Route("api/activity-feeds/recent")]
        public IHttpActionResult LoadRecentFeeds([FromBody] LoadEntryInfo info)
            => _activityFeed.LoadRecentFeeds(info.Count, info.From.Value)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpPost]
        [Route("api/activity-feeds/pinned-entries")]
        public IHttpActionResult PinEntry([FromBody] PostInfo info)
            => _activityFeed.PinEntry(info.PostId, info.PostContext)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpDelete]
        [Route("api/activity-feeds/pinned-entries")]
        public IHttpActionResult UnpinEntry([FromBody] PinnedPostInfo info)
            => _activityFeed.UnpinEntry(info.PinId)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpGet]
        [Route("api/activity-feeds/pinned-entries")]
        public IHttpActionResult LoadPinnedFeeds([FromBody] LoadEntryInfo info)
            => _activityFeed.LoadPinnedFeeds(info.Count, info.From)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

    }

    namespace ActivityFeedModels
    {
        public class LoadEntryInfo
        {
            public int Count { get; set; }
            public DateTime? From { get; set; }
        }

        public class PostInfo
        {
            public long PostId { get; set; }
            public string PostContext { get; set; }
        }

        public class PinnedPostInfo
        {
            public long PinId { get; set; }
            public long PinContextId { get; set; }
            public string PinContext { get; set; }
        }
    }
}
