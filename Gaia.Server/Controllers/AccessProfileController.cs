using Gaia.Core.Services;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Axis.Jupiter;
using Axis.Luna.Extensions;
using Gaia.Core.Domain;
using Gaia.Server.Controllers.AccessProfileModel;

namespace Gaia.Server.Controllers
{
    public class AccessProfileController : ApiController
    {
        private IAccessProfileService _accessProfile = null;
        private IDataContext _dataService = null;

        public AccessProfileController(IAccessProfileService accessProfileService, IDataContext dataService)
        {
            ThrowNullArguments(() => accessProfileService, () => dataService);

            this._accessProfile = accessProfileService;
            this._dataService = dataService;
        }

        [HttpPost]
        [Route("api/access-profiles/@{profileCode}/@{title}")]
        IHttpActionResult CreateFeatureAccessProfile(string profileCode, string title)
            => _accessProfile.CreateFeatureAccessProfile(profileCode, title)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/access-profiles")]
        IHttpActionResult ModifyFeatureAccessProfile([FromBody]AccessProfileInfo info)
            => _accessProfile.ModifyFeatureAccessProfile(info.Profile, info.Granted, info.Denied)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpPut]
        [Route("api/access-profiles/archives/@{profileId}")]
        IHttpActionResult ArchiveAccessProfile(long profileId)
            => _accessProfile.ArchiveAccessProfile(profileId)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpPut]
        [Route("api/access-profiles/applications")]
        IHttpActionResult ApplyAccessProfile([FromBody]AccessProfileApplication application)
            => _accessProfile.ApplyAccessProfile(application.UserId, application.Code, application.ExpiryDate)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpDelete]
        [Route("api/access-profiles/@{userId}/@{accessProfileCode}")]
        IHttpActionResult RevokeAccessProfile(string userId, string accessProfileCode)
            => _accessProfile.RevokeAccessProfile(userId, accessProfileCode)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpPut]
        [Route("api/access-profiles/migrations")]
        IHttpActionResult MigrateAccessProfile([FromBody]AccessProfileMigration migration)
            => _accessProfile.MigrateAccessProfile(migration.UserId, migration.OldAccessProfileCode, migration.NewAccessProfileCode, migration.NewExpiry)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpGet]
        [Route("api/access-profiles/@{userId}")]
        IHttpActionResult ActiveUserAccessProfiles(string userId)
            => _accessProfile.ActiveUserAccessProfiles(userId)
                  .Then(opr => this.Ok().As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;
    }



    namespace AccessProfileModel
    {
        public class AccessProfileInfo
        {
            public FeatureAccessProfile Profile { get; set; }
            public string[] Granted { get; set; }
            public string[] Denied { get; set; }
        }

        public class AccessProfileApplication
        {
            public string UserId { get; set; }
            public string Code { get; set; }
            public DateTime? ExpiryDate { get; set; }
        }

        public class AccessProfileMigration
        {
            public string UserId { get; set; }
            public string OldAccessProfileCode { get; set; }
            public string NewAccessProfileCode { get; set; }
            public DateTime? NewExpiry { get; set; }
        }
    }
}
