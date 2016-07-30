using Axis.Luna.Extensions;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;

namespace Gaia.Core.Services
{
    public class PostService : IPostService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }

        public PostService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<Post> Archive(long postId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.Query
                                .Where(post => post.EntityId == postId)
                                .Where(post => post.OwnerId == user.UserId)
                                .Where(post => post.Status != PostStatus.Archived)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find post")
                                .UsingValue(post => poststore.Modify(post.With(new { Status = PostStatus.Archived }), true));
            });

        public Operation<Post> CreatePost(string title)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.NewObject().With(new
                {
                    Title = title,
                    CreatedBy = user.UserId,
                    OwnerId = user.UserId,
                    Status = PostStatus.Private,
                    ParentPostId = 0
                })
                .UsingValue(_post => poststore.Add(_post).Context.CommitChanges());
            });

        public Operation<Post> EditPost(Post post)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.Query
                                .Where(_post => _post.OwnerId == user.UserId)
                                .Where(_post => _post.EntityId == post.EntityId)
                                .Where(_post => _post.Status != PostStatus.Archived)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find post")
                                .UsingValue(_post =>
                                {
                                    if (_post.Status == PostStatus.Shared)
                                    {
                                        //get previous history
                                        var oldHistory = poststore.Query.FirstOrDefault(_history => _history.ParentPostId == _post.EntityId);

                                        //create and persist a new history snapshot
                                        var newHistory = poststore.NewObject().With(new
                                        {
                                            CreatedBy = user.UserId,
                                            CreatedOn = _post.CreatedOn,
                                            Message = _post.Message,
                                            OwnerId = user.UserId,
                                            Status = _post.Status,
                                            TargetDemographic = _post.TargetDemographic,
                                            Title = _post.Title,
                                            ParentPostId = _post.EntityId,
                                            ModifiedBy = user.UserId,
                                            ModifiedOn = _post.ModifiedOn
                                        });
                                        poststore.Add(newHistory).Context.CommitChanges();

                                        //chain and persist the old history
                                        if(oldHistory != null) poststore.Modify(oldHistory.With(new { ParentPostId = newHistory.EntityId }), true);
                                    }

                                    _post.Message = post.Message;
                                    _post.TargetDemographic = post.TargetDemographic;
                                    _post.Title = post.Title;
                                });
            });

        public Operation<Post> Share(long postId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.Query
                                .Where(post => post.EntityId == postId)
                                .Where(post => post.OwnerId == user.UserId)
                                .Where(post => post.Status == PostStatus.Private)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find post")
                                .UsingValue(post => poststore.Modify(post.With(new { Status = PostStatus.Archived }), true));
            });
    }
}
