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
                                .Where(post => post.OwnerId == user.EntityId)
                                .Where(post => post.Status != PostStatus.Archived)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find post")
                                .UsingValue(post =>
                                {
                                    post.Status = PostStatus.Archived;
                                    poststore.Modify(post, true);
                                });
            });

        public Operation<Post> CreatePost(string title)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.NewObject().UsingValue(_post =>
                {
                    _post.Title = title;
                    _post.CreatedBy = user.UserId;
                    _post.OwnerId = user.UserId;
                    _post.Status = PostStatus.Private;
                    _post.ParentPostId = 0;

                    poststore.Add(_post).Context.CommitChanges();
                });
            });

        public Operation<Post> EditPost(Post post)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.Query
                                .Where(_post => _post.OwnerId == user.EntityId)
                                .Where(_post => _post.EntityId == post.EntityId)
                                .Where(_post => _post.Status != PostStatus.Archived)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find post")
                                .UsingValue(_post =>
                                {
                                    if (_post.Status == PostStatus.Published)
                                    {
                                        //get previous history
                                        var oldHistory = poststore.Query.FirstOrDefault(_history => _history.ParentPostId == _post.EntityId);

                                        //create and persist a new history snapshot
                                        var newHistory = poststore.NewObject().UsingValue(_history =>
                                        {
                                            _history.CreatedBy = user.UserId;
                                            _history.CreatedOn = _post.CreatedOn;
                                            _history.Message = _post.Message;
                                            _history.OwnerId = user.UserId;
                                            _history.Status = _post.Status;
                                            _history.TargetDemographic = _post.TargetDemographic;
                                            _history.Title = _post.Title;
                                            _history.ParentPostId = _post.EntityId;
                                            _history.ModifiedBy = user.UserId;
                                            _history.ModifiedOn = _post.ModifiedOn;

                                            poststore.Add(_history).Context.CommitChanges();
                                        });

                                        //chain and persist the old history
                                        if (oldHistory != null)
                                        {
                                            oldHistory.ParentPostId = newHistory.EntityId;
                                            poststore.Modify(oldHistory, true);
                                        }
                                    }

                                    _post.Message = post.Message;
                                    _post.TargetDemographic = post.TargetDemographic;
                                    _post.Title = post.Title;
                                });
            });

        public Operation<Post> Publish(long postId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var poststore = DataContext.Store<Post>();
                return poststore.Query
                                .Where(post => post.EntityId == postId)
                                .Where(post => post.OwnerId == user.EntityId)
                                .Where(post => post.Status == PostStatus.Private)
                                .FirstOrDefault()
                                .ThrowIfNull("could not find post")
                                .UsingValue(post =>
                                {
                                    post.Status = PostStatus.Published;
                                    poststore.Modify(post, true);
                                });
            });
    }
}
