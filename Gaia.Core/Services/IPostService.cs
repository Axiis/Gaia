﻿using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;

namespace Gaia.Core.Services
{
    public interface IPostService : IUserContextAware
    {
        [Feature("system/User/Post/@create")]
        Operation<Post> CreatePost(string title);

        [Feature("system/User/Post/@edit")]
        Operation<Post> EditPost(Post post);

        [Feature("system/User/Post/@share")]
        Operation<Post> Share(long postId);

        [Feature("system/User/Post/@archive")]
        Operation<Post> Archive(long postId);
    }
}
