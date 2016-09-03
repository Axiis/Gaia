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

        public Operation<Comment> CommentOn(string contextName, long contextId, string comment)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var commentstore = DataContext.Store<Comment>();
                return commentstore.NewObject().UsingValue(_c =>
                {
                    _c.Text = comment;
                    _c.CreatedBy = user.UserId;
                    _c.OwnerId = user.UserId;
                    _c.ContextType = contextName;
                    _c.ContextId = contextId;

                    commentstore.Add(_c).Context.CommitChanges();
                });
            });

        public Operation<UserReaction> ReactTo(string contextName, long contextId, string reaction)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var rxstore = DataContext.Store<UserReaction>();
                var user = UserContext.CurrentUser;
                return (rxstore.Query
                               .Where(rx => rx.ContextId == contextId)
                               .Where(rx => rx.OwnerId == user.EntityId)
                               .Where(rx => rx.ContextType == contextName)
                               .FirstOrDefault() ??
                        rxstore.NewObject().UsingValue(_rx =>
                        {
                            _rx.ContextId = contextId;
                            _rx.ContextType = contextName;
                            _rx.CreatedBy = user.UserId;
                            _rx.OwnerId = user.UserId;

                            rxstore.Add(_rx).Context.CommitChanges();
                        }))
                        .UsingValue(_rx =>
                        {
                            _rx.Reaction = reaction;
                            rxstore.Modify(_rx, true);
                        });
            });

        public Operation<Comment> ReplyTo(long parentCommentId, string comment)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var commentStore = DataContext.Store<Comment>();
                var user = UserContext.CurrentUser;
                var parentComment = commentStore.Query.FirstOrDefault(cmt => cmt.EntityId == parentCommentId);
                return commentStore.NewObject().UsingValue(_c =>
                {
                    _c.ContextId = parentComment.EntityId;
                    _c.ContextType = typeof(Comment).GaiaDomainTypeName();
                    _c.OwnerId = user.UserId;
                    _c.CreatedBy = user.UserId;
                    _c.Text = comment;

                    commentStore.Add(_c).Context.CommitChanges();
                });
            });

        public Operation<IEnumerable<Comment>> CommentsFor(string contextName, long contextId)
            => FeatureAccess.Guard(UserContext, () => DataContext.ContextQuery<Comment>(NamedQueries.CommentHierarchy, contextId).AsEnumerable());
    }
}
