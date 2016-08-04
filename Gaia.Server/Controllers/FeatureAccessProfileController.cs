using Axis.Jupiter;
using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Axis.Luna.Extensions;
using Gaia.Core.Utils;

namespace Gaia.Server.Controllers
{
    public class FeatureAccessProfileController: ApiController
    {
        private IAccessProfileService _accessProfileService = null;
        private IDataContext _dataContext = null;

        public FeatureAccessProfileController(IDataContext dataAccessService, IAccessProfileService accessProfileService)
        {
            ThrowNullArguments(() => dataAccessService, () => accessProfileService);

            this._accessProfileService = accessProfileService;
            this._dataContext = dataAccessService;
        }

        [HttpPost]
        [Route("api/feature-access/profiles/{profileCode}/{title}")]
        IHttpActionResult CreateFeatureAccessProfile(string profileCode, string title)
        {
            return _accessProfileService.CreateFeatureAccessProfile(profileCode, title)
                                        .Then<FeatureAccessProfile, IHttpActionResult>(op => Ok(op.Result))
                                        .Instead(op => op.GetException() is FeatureAccessException?
                                                       this.Unauthorized().As<IHttpActionResult>():
                                                       this.InternalServerError(op.GetException()))
                                        .Result;
        }


        [HttpPut]
        [Route("api/feature-access/profiles")]
        IHttpActionResult ModifyFeatureAccessProfile([FromBody] Models.FeatureProfileMutationModel featureProfileInfo)
        {

        }

        IHttpActionResult ArchiveAccessProfile(long profileId);

        IHttpActionResult ApplyAccessProfile(string userId, string accessProfileCode, DateTime? expiryDate);

        IHttpActionResult RevokeAccessProfile(string userId, string accessProfileCode);

        IHttpActionResult MigrateAccessProfile(string userId, string oldAccessProfileCode, string newAccessProfileCode, DateTime? newExpiry);

        IHttpActionResult ActiveUserAccessProfiles(string userId);
    }


    namespace Models
    {
        public class FeatureProfileMutationModel
        {
            public FeatureAccessProfile Profile { get; set; }
            public string[] GrantedDescriptors { get; set; }
            public string[] DeniedDescriptors { get; set; }
        }
    }
}