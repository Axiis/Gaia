using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using System.Web.Http;
using Gaia.Core.Services;
using Gaia.Core.Domain;
using Axis.Luna;

namespace Gaia.Server.Controllers
{
    public class PostsController : ApiController
    {
        private IPostService _postService = null;

        public PostsController(IPostService postService)
        {
            ThrowNullArguments(() => postService);

            this._postService = postService;
        }

        [HttpPost]
        [Route("api/posts/@{title}")]
        IHttpActionResult CreatePost(string title)
            => _postService.CreatePost(title)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;

        [HttpPut]
        [Route("api/posts")]
        IHttpActionResult EditPost([FromBody]PostModels.Post post)
            => Operation.Try(() => post.ToDomain())
                .Then(opr => _postService.EditPost(opr.Result))
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;


        [HttpPut]
        [Route("api/posts/published/@{postId}")]
        IHttpActionResult Publish(long postId)
            => _postService.Publish(postId)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;


        [HttpPut]
        [Route("api/posts/archived/@{postId}")]
        IHttpActionResult Archive(long postId)
            => _postService.Archive(postId)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;
    }

    namespace PostModels
    {
        public class Post
        {
            public long Id { get; set; }

            public string Title { get; set; }

            public string Message { get; set; }

            public PostStatus Status { get; set; }
            
            public string OwnerId { get; set; }

            /// <summary>
            /// Historical snapshot of this post
            /// </summary>
            public long ParentPostId { get; set; }

            /// <summary>
            /// Json array of objects defining the demographic
            /// </summary>
            public string TargetDemographic { get; set; }

            public Core.Domain.Post ToDomain() => new Core.Domain.Post
            {
                EntityId = Id,
                Title = Title,
                Message = Message,
                Status = Status,
                OwnerId = OwnerId,
                ParentPostId = ParentPostId,
                TargetDemographic = TargetDemographic
            };
        }
    }
}
