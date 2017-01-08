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
        [Route("api/posts")]
        public IHttpActionResult CreatePost([FromBody]PostModels.Post post)
            => _postService.CreatePost(post.Title)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/posts")]
        public IHttpActionResult EditPost([FromBody]PostModels.Post post)
            => Operation.Try(() => post.ToDomain())
                .Then(opr => _postService.EditPost(opr.Result))
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpPut]
        [Route("api/posts/published")]
        public IHttpActionResult Publish([FromBody]PostModels.Post post)
            => _postService.Publish(post.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;


        [HttpPut]
        [Route("api/posts/archived")]
        public IHttpActionResult Archive([FromBody]PostModels.Post post)
            => _postService.Archive(post.Id)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => Content(System.Net.HttpStatusCode.InternalServerError, opr))
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
