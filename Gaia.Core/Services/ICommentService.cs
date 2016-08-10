using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface ICommentService : IUserContextAware
    {
        [Feature("system/Comments/@comments-for")]
        Operation<IEnumerable<Comment>> CommentsFor(string contextName, string contextId);

        [Feature("system/Comments/@comment-on")]
        Operation<Comment> CommentOn(string contextName, string contextId, string comment);

        [Feature("system/Comments/@reply-to")]
        Operation<Comment> ReplyTo(long parentCommentId, string comment);

        [Feature("system/Comments/@react-to")]
        Operation<UserReaction> ReactTo(string contextName, string contextId, string reaction);
    }
}
