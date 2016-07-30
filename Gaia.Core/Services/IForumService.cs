using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;

namespace Gaia.Core.Services
{
    public interface IForumService : IUserContextAware
    {
        [Feature("system/Forums/Topic/@create")]
        Operation<ForumTopic> CreateTopic(string title);

        [Feature("system/Forums/Topic/@modify")]
        Operation<ForumTopic> ModifyTopic(ForumTopic topic);

        [Feature("system/Forums/Topic/@flag")]
        Operation<ForumTopic> FlagTopic(long topicId);


        [Feature("system/User/Forum/Thread/@create")]
        Operation<ForumThread> CreateThread(string title, long topic);

        [Feature("system/User/Forum/Thread/@modify")]
        Operation<ForumThread> ModifyThread(ForumThread thread);

        [Feature("system/User/Forum/Thread/@flag")]
        Operation<ForumThread> FlagThread(long threadId);

        [Feature("system/User/Forum/Thread/@watch")]
        Operation<ForumThreadWatch> WatchThread(long threadId);
    }
}
