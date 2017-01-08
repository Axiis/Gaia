using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;

using Gaia.Core.Services;
using System.Web.Http;
using Axis.Luna.Extensions;
using Gaia.Core.Domain;
using Axis.Luna;

namespace Gaia.Server.Controllers
{
    public class ForumController : ApiController
    {
        private IForumService _forumService = null;

        public ForumController(IForumService forumService)
        {
            ThrowNullArguments(() => forumService);

            this._forumService = forumService;
        }

        [HttpPost]
        [Route("api/forums/topics")]
        public IHttpActionResult CreateTopic([FromBody]ForumModels.ForumInfo info)
            => _forumService.CreateTopic(info.Title)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/forums/topics")]
        public IHttpActionResult ModifyTopic([FromBody]ForumModels.ForumTopic topic)
            => Operation.Try(() => topic.ToDomain())
                .Then(opr => _forumService.ModifyTopic(opr.Result))
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/forums/topics/flagged")]
        public IHttpActionResult FlagTopic([FromBody]ForumModels.ForumInfo info)
            => _forumService.FlagTopic(info.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/forums/threads")]
        public IHttpActionResult CreateThread([FromBody]ForumModels.ForumInfo info)
            => _forumService.CreateThread(info.Title, info.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/forums/threads")]
        public IHttpActionResult ModifyThread([FromBody]ForumModels.ForumThread thread)
            => Operation.Try(() => thread.ToDomain())
                .Then(opr => _forumService.ModifyThread(opr.Result))
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/forums/threads/flagged")]
        public IHttpActionResult FlagThread([FromBody]ForumModels.ForumInfo info)
            => _forumService.FlagThread(info.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/forums/threads/watched")]
        public IHttpActionResult WatchThread([FromBody]ForumModels.ForumInfo info)
            => _forumService.WatchThread(info.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
    }


    namespace ForumModels
    {
        public class ForumTopic
        {
            public long Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public ForumTopicStatus Status { get; set; }

            public Core.Domain.ForumTopic ToDomain() => new Core.Domain.ForumTopic
            {
                EntityId = Id,
                Title = Title,
                Description = Description,
                Status = Status
            };
        }

        public class ForumThread
        {
            public long Id { get; set; }

            public string Owner { get; set; }

            public string Title { get; set; }

            public string Content { get; set; }

            public long TopicId { get; set; }

            public ForumThreadStatus Status { get; set; }

            public Core.Domain.ForumThread ToDomain() => new Core.Domain.ForumThread
            {
                EntityId = Id,
                Title = Title,
                Content = Content,
                Status = Status,
                OwnerId = Owner,
                TopicId = TopicId
            };
        }

        public class ForumInfo
        {
            public string Title { get; set; }
            public string Topic { get; set; }
            public long Id { get; set; }
        }
    }
}
