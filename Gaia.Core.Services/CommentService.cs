using Axis.Luna.Extensions;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;
using System;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public class CommentService : ICommentService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }

        public CommentService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<Comment> CommentOn(string contextName, string contextId, string comment)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var commentstore = DataContext.Store<Comment>();
                return commentstore.NewObject().With(new
                {
                    Text = comment,
                    CreatedBy = user.UserId,
                    OwnerId = user.UserId,
                    ContextType = contextName,
                    ContextId = contextId
                })
                .UsingValue(_comment => commentstore.Add(_comment).Context.CommitChanges());
            });

        public Operation<UserReaction> ReactTo(string contextName, string contextId, string reaction)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var rxstore = DataContext.Store<UserReaction>();
                var user = UserContext.CurrentUser;
                return (rxstore.Query
                               .Where(rx => rx.ContextId == contextId)
                               .Where(rx => rx.OwnerId == user.UserId)
                               .Where(rx => rx.ContextType == contextName)
                               .FirstOrDefault()??
                        rxstore.NewObject().With(new
                        {
                            ContextId = contextId,
                            ContextType = contextName,
                            CreatedBy = user.UserId,
                            OwnerId = user.UserId
                        })
                        .UsingValue(rx => rxstore.Add(rx).Context.CommitChanges()))
                        .UsingValue(rx => rxstore.Modify(rx.With(new { Reaction = reaction }), true));
            });

        public Operation<Comment> ReplyTo(long parentCommentId, string comment)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var commentStore = DataContext.Store<Comment>();
                var user = UserContext.CurrentUser;
                var parentComment = commentStore.Query.FirstOrDefault(cmt => cmt.EntityId == parentCommentId);
                return commentStore.NewObject().With(new
                {
                    ContextId = parentComment.EntityId.ToString(),
                    ContextType = typeof(Comment).GaiaDomainTypeName(),
                    OwnerId = user.UserId,
                    CreatedBy = user.UserId,
                    Text = comment
                })
                .UsingValue(cmt => commentStore.Add(cmt).Context.CommitChanges());
            });

        public Operation<IEnumerable<Comment>> CommentsFor(string contextName, string contextId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var commentStore = DataContext.Store<Comment>();
            });
    }
}
