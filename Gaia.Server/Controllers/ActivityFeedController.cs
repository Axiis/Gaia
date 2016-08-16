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
        [Route("api/activity-feeds/@{count}/@{from}")]
        public IHttpActionResult LoadPastFeeds(int count, DateTime? from)
            => _activityFeed.LoadPastFeeds(count, from)
                .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                .Instead(opr => this.InternalServerError(opr.GetException()))
                .Result;


        [HttpGet]
        [Route("api/activity-feeds/recent/@{count}/@{from}")]
        public IHttpActionResult LoadRecentFeeds(int count, DateTime from)
            => _activityFeed.LoadRecentFeeds(count, from)
                .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                .Instead(opr => this.InternalServerError(opr.GetException()))
                .Result;


        [HttpPost]
        [Route("api/activity-feeds/pinned-entries/@{postId}/@{postType}")]
        public IHttpActionResult PinEntry(long postId, string postType)
            => _activityFeed.PinEntry(postId, postType)
                .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                .Instead(opr => this.InternalServerError(opr.GetException()))
                .Result;


        [HttpDelete]
        [Route("api/activity-feeds/pinned-entries/@{pinId}")]
        public IHttpActionResult UnpinEntry(long pinId)
            => _activityFeed.UnpinEntry(pinId)
                .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                .Instead(opr => this.InternalServerError(opr.GetException()))
                .Result;


        [HttpDelete]
        [Route("api/activity-feeds/pinned-entries/@{pinContextId}/@{pinContextType}")]
        public IHttpActionResult UnpinEntry(long pinContextId, string pinContextType)
            => _activityFeed.UnpinEntry(pinContextId, pinContextType)
                .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                .Instead(opr => this.InternalServerError(opr.GetException()))
                .Result;


        [HttpGet]
        [Route("api/activity-feeds/pinned-entries/@{count}/@{from}")]
        public IHttpActionResult LoadPinnedFeeds(int count, DateTime? from)
            => _activityFeed.LoadPinnedFeeds(count, from)
                .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                .Instead(opr => this.InternalServerError(opr.GetException()))
                .Result;

    }
}
