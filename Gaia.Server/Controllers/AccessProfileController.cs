using Gaia.Core.Services;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;

using System;
using System.Web.Http;
using Axis.Jupiter;
using Axis.Luna.Extensions;
using Gaia.Core.Domain;
using Gaia.Server.Controllers.AccessProfileModel;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text;
using Gaia.Server.Utils;

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
        [Route("api/access-profiles")]
        public IHttpActionResult CreateFeatureAccessProfile([FromBody]AccessProfileCreationInfo info)
            => _accessProfile.CreateFeatureAccessProfile(info.Code, info.Title)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/access-profiles")]
        public IHttpActionResult ModifyFeatureAccessProfile([FromBody]AccessProfileInfo info)
            => _accessProfile.ModifyFeatureAccessProfile(info.Profile, info.Granted.ToArray(), info.Denied.ToArray())
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpPut]
        [Route("api/access-profiles/archives")]
        public IHttpActionResult ArchiveAccessProfile([FromBody] AccessProfileArchiveInfo info)
            => _accessProfile.ArchiveAccessProfile(info.Id)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpPut]
        [Route("api/access-profiles/applications")]
        public IHttpActionResult ApplyAccessProfile([FromBody]AccessProfileApplication application)
            => _accessProfile.ApplyAccessProfile(application.UserId, application.Code, application.ExpiryDate)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpDelete]
        [Route("api/access-profiles")]
        public IHttpActionResult RevokeAccessProfile(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<AccessProfileRevokeInfo>(_json))
                .Pipe(info => _accessProfile.RevokeAccessProfile(info.UserId, info.Code))
                .Pipe(_op => _op.OperationResult(Request));


        [HttpPut]
        [Route("api/access-profiles/migrations")]
        public IHttpActionResult MigrateAccessProfile([FromBody]AccessProfileMigration migration)
            => _accessProfile.MigrateAccessProfile(migration.UserId, migration.OldAccessProfileCode, migration.NewAccessProfileCode, migration.NewExpiry)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpGet]
        [Route("api/access-profiles/active")]
        public IHttpActionResult ActiveUserAccessProfiles(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<AccessProfileOwnerInfo>(_json))
                .Pipe(info => _accessProfile.ActiveUserAccessProfiles(info.UserId))
                .Pipe(_op => _op.OperationResult(Request));
    }



    namespace AccessProfileModel
    {
        public class AccessProfileInfo
        {
            public FeatureAccessProfile Profile { get; set; }
            public List<string> Granted { get; set; }
            public List<string> Denied { get; set; }
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

        public class AccessProfileCreationInfo
        {
            public string Code { get; set; }
            public string Title { get; set; }
        }

        public class AccessProfileArchiveInfo
        {
            public long Id { get; set; }
        }

        public class AccessProfileRevokeInfo
        {
            public string UserId { get; set; }
            public string Code { get; set; }
        }

        public class AccessProfileOwnerInfo
        {
            public string UserId { get; set; }
        }
    }
}
