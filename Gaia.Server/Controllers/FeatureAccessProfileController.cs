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
            => _accessProfileService.CreateFeatureAccessProfile(profileCode, title)
                   .Then<FeatureAccessProfile, IHttpActionResult>(op => Ok(op.Result))
                   .Instead(op => op.GetException() is FeatureAccessException?
                                  this.Unauthorized().As<IHttpActionResult>():
                                  this.InternalServerError(op.GetException()))
                   .Result;


        [HttpPut]
        [Route("api/feature-access/profiles")]
        IHttpActionResult ModifyFeatureAccessProfile([FromBody] Models.FeatureProfileMutationModel featureProfileInfo)
            => _accessProfileService.ModifyFeatureAccessProfile(featureProfileInfo?.Profile, featureProfileInfo?.GrantedDescriptors, featureProfileInfo?.DeniedDescriptors)
                .Then(op => Ok(op.Result).As<IHttpActionResult>())
                .Instead(op => op.GetException() is FeatureAccessException ?
                               this.Unauthorized().As<IHttpActionResult>() :
                               this.InternalServerError(op.GetException()))
                .Result;

        IHttpActionResult ArchiveAccessProfile(long profileId)
            => _accessProfileService.ArchiveAccessProfile(profileId)
                .Then(op => Ok(op).As<IHttpActionResult>())
                .Instead(op => op.GetException() is FeatureAccessException ?
                               this.Unauthorized().As<IHttpActionResult>() :
                               this.InternalServerError(op.GetException()))
                .Result;

        IHttpActionResult ApplyAccessProfile([FromBody]Models.FeatureProfileApplicationInfo ainfo)
            => _accessProfileService.ApplyAccessProfile(ainfo.UserId, ainfo.AccessProfileCode, ainfo.ExpiryDate)
                .Then(op => Ok(op).As<IHttpActionResult>())
                .Instead(op => op.GetException() is FeatureAccessException ?
                               this.Unauthorized().As<IHttpActionResult>() :
                               this.InternalServerError(op.GetException()))
                .Result;

        IHttpActionResult RevokeAccessProfile(string userId, string accessProfileCode)
            => _accessProfileService.RevokeAccessProfile(userId, accessProfileCode)
                .Then(op => Ok(op).As<IHttpActionResult>())
                .Instead(op => op.GetException() is FeatureAccessException ?
                               this.Unauthorized().As<IHttpActionResult>() :
                               this.InternalServerError(op.GetException()))
                .Result;

        IHttpActionResult MigrateAccessProfile([FromBody]Models.FeatureProfileMigrationInfo minfo)
            => _accessProfileService.MigrateAccessProfile(minfo.UserId, minfo.OldAccessProfileCode, minfo.NewAccessProfileCode, minfo.NewExpiry)
                .Then(op => Ok(op).As<IHttpActionResult>())
                .Instead(op => op.GetException() is FeatureAccessException ?
                               this.Unauthorized().As<IHttpActionResult>() :
                               this.InternalServerError(op.GetException()))
                .Result;

        IHttpActionResult ActiveUserAccessProfiles(string userId)
            => _accessProfileService.ActiveUserAccessProfiles(userId)
                .Then(op => Ok(op).As<IHttpActionResult>())
                .Instead(op => op.GetException() is FeatureAccessException ?
                               this.Unauthorized().As<IHttpActionResult>() :
                               this.InternalServerError(op.GetException()))
                .Result;
    }


    namespace Models
    {
        public class FeatureProfileMutationModel
        {
            public FeatureAccessProfile Profile { get; set; }
            public string[] GrantedDescriptors { get; set; }
            public string[] DeniedDescriptors { get; set; }
        }

        public class FeatureProfileMigrationInfo
        {
            public string UserId { get; set; }
            public string OldAccessProfileCode { get; set; }
            public string NewAccessProfileCode { get; set; }
            public DateTime? NewExpiry { get; set; }
        }

        public class FeatureProfileApplicationInfo
        {
            public string UserId{ get; set; }
            public string AccessProfileCode{ get; set; }
            public DateTime? ExpiryDate{ get; set; }
        }
    }
}