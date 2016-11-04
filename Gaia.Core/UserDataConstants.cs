using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Axis.Pollux.Identity.Principal;

using static Axis.Luna.Extensions.ExceptionExtensions;

namespace Gaia.Core
{
    public static class UserDataConstants
    {
        /// <summary>
        /// <para>User Profile Image.</para>
        /// 
        /// This value represents the users profile image. it's data will be either a url pointing to an image, or a Luna.BinaryData that contains 
        /// the image data.
        /// </summary>
        public static readonly UserData DefaultProfileImage = new UserData
        {
            Name = "ProfileImage",
            Type = Axis.Luna.CommonDataType.Url,
            Data = "{'Name':'IMG-20161003-WA0009.jpg','Mime':'image/jpeg','Data':'/content/images/default-200.jpg','IsDataEmbeded':false}" //<-- url to a default image
        };
        public static UserData CloneForUser(this UserData original, string userId) => new UserData
        {
            Data = original.Data,
            Name = original.Name,
            OwnerId = userId.ThrowIf(_ => string.IsNullOrWhiteSpace(_), "invalid userId"),
            Type=  original.Type
        };
    }
}
