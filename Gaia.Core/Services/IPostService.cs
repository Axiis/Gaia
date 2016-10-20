using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;

namespace Gaia.Core.Services
{
    public interface IPostService : IGaiaService, IUserContextAware
    {
        [Feature("system/Post/@create")]
        Operation<Post> CreatePost(string title);

        [Feature("system/Post/@edit")]
        Operation<Post> EditPost(Post post);

        [Feature("system/Post/@publish")]
        Operation<Post> Publish(long postId);

        [Feature("system/Post/@archive")]
        Operation<Post> Archive(long postId);
    }
}
