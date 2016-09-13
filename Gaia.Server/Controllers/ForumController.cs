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
        [Route("api/forums/topics/@{title}")]
        public IHttpActionResult CreateTopic(string title)
            => _forumService.CreateTopic(title)
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
        [Route("api/forums/topics/flagged/@{topicId}")]
        public IHttpActionResult FlagTopic(long topicId)
            => _forumService.FlagTopic(topicId)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/forums/topics/@{topic}/threads/@{title}")]
        public IHttpActionResult CreateThread(string title, long topic)
            => _forumService.CreateThread(title, topic)
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
        [Route("api/forums/threads/@{threadId}")]
        public IHttpActionResult FlagThread(long threadId)
            => _forumService.FlagThread(threadId)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/forums/threads/@{threadId}/watched")]
        public IHttpActionResult WatchThread(long threadId)
            => _forumService.WatchThread(threadId)
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
    }
}
