using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class Post: GaiaEntity<long>
    {
        public string Title
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string Message
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public PostStatus Status
        {
            get { return get<PostStatus>(); }
            set { set(ref value); }
        }

        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }
        public string OwnerId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// Historical snapshot of this post
        /// </summary>
        public long ParentPostId
        {
            get { return get<long>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// Json array of objects defining the demographic
        /// </summary>
        public string TargetDemographic
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
    }

    public enum PostStatus
    {
        Private,
        Published,
        Archived
    }
}
