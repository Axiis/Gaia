using static Axis.Luna.Extensions.ExceptionExtensions;

using Axis.Jupiter;
using Axis.Pollux.Authentication;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Services;
using Gaia.Server.Controllers.ProfileModels;
using System.Linq;
using System.Web.Http;
using Axis.Luna.Extensions;
using System.Collections.Generic;
using System.Text;

namespace Gaia.Server.Controllers
{
    public class ProfileController : ApiController
    {
        private IProfileService _profileService = null;
        private IDataContext _dataStore = null; //<-- for specialized query scenarios where i'll have to return business objects to the client

        public ProfileController(IProfileService profileService, IDataContext dataService)
        {
            ThrowNullArguments(() => profileService, () => dataService);

            this._profileService = profileService;
            this._dataStore = dataService;
        }


        [HttpPost]
        [Route("api/profiles")]
        public IHttpActionResult RegisterUser([FromBody]RegistrationInfo info)
            => _profileService.RegisterUser(info.TargetUser, info.Credentials?.Select(_ci => _ci.ToCredential()).ToArray() ?? new Credential[0])
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPost]
        [Route("api/admin-profiles")]
        public IHttpActionResult RegisterAdminUser([FromBody]RegistrationInfo info)
            => _profileService.RegisterAdminUser(info.TargetUser, info.Credentials?.Select(_ci => _ci.ToCredential()).ToArray() ?? new Credential[0])
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/profiles/verification")]
        public IHttpActionResult VerifyUserRegistration([FromBody]UserValueInfo userValue)
            => _profileService.VerifyUserRegistration(userValue.User, userValue.Value)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/profiles/archives")]
        public IHttpActionResult ArchiveUser([FromBody]UserValueInfo userValue)
            => _profileService.ArchiveUser(userValue.User)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPost]
        [Route("api/profiles/activation")]
        public IHttpActionResult CreateUserActivationVerification([FromBody]UserValueInfo userValue)
            => _profileService.CreateUserActivationVerification(userValue.User)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/profiles/activation")]
        public IHttpActionResult VerifyUserActivation([FromBody]UserValueInfo userValue)
            => _profileService.VerifyUserActivation(userValue.User, userValue.Value)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpGet]
        [Route("api/profiles/discovered")]
        public IHttpActionResult Discover()
            => _profileService.Discover()
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        #region user-data
        [HttpPut]
        [Route("api/profiles/data")]
        public IHttpActionResult AddData([FromBody]UserDataInfo data)
            => _profileService.AddData(data.DataList.ToArray())
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpDelete]
        [Route("api/profiles/data")] //<-- http://abcd.xyz/api/profiles/data/?dataNames=abcd,efgh,ijkl,etc
        public IHttpActionResult RemoveData([FromUri]string dataNames)
            => _profileService.RemoveData(dataNames?.Split(',') ?? new string[0])
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpGet]
        [Route("api/profiles/data")]
        public IHttpActionResult GetUserData()
            => _profileService.GetUserData()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion

        #region bio-data
        [HttpGet]
        [Route("api/profiles/bio-data")]
        public IHttpActionResult GetBioData()
            => _profileService.GetBioData()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/profiles/bio-data")]
        public IHttpActionResult ModifyBioData([FromBody]BioData data)
            => _profileService.ModifyBioData(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion

        #region contact-data
        [HttpGet]
        [Route("api/profiles/contact-data")]
        public IHttpActionResult GetContactData()
            => _profileService.GetContactData()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/profiles/contact-data")]
        public IHttpActionResult ModifyContactData([FromBody]ContactData data)
            => _profileService.ModifyContactData(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpDelete]
        [Route("api/profiles/contact-data")] //<-- http://abcd.xyz/api/profiles/contact-data/?ids=1,5,3,2,76,etc
        public IHttpActionResult RemoveContactData([FromUri]string ids)
            => _profileService.RemoveContactData(ids?.Split(',').Select(_id => long.Parse(_id)).ToArray() ?? new long[0])
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion

        #region corporate-data
        [HttpGet]
        [Route("api/profiles/corporate-data")]
        public IHttpActionResult GetCorporateData()
            => _profileService.GetCorporateData()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/profiles/corporate-data")]
        public IHttpActionResult ModifyCorporate([FromBody]CorporateData data)
            => _profileService.ModifyCorporateData(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpDelete]
        [Route("api/profiles/corporate-data")] //<-- http://abcd.xyz/api/profiles/contact-data/?ids=1,5,3,2,76,etc
        public IHttpActionResult RemoveCorporateData([FromUri]string ids)
            => _profileService.RemoveCorporateData(ids?.Split(',').Select(_id => long.Parse(_id)).ToArray() ?? new long[0])
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion
    }



    namespace ProfileModels
    {
        public class RegistrationInfo
        {
            public string TargetUser { get; set; }
            public List<CredentialInfo> Credentials { get; set; }
        }

        public class CredentialInfo
        {
            public virtual CredentialMetadata Metadata { get; set; }
            public string Value { get; set; }

            public byte[] BinaryValue => Encoding.Unicode.GetBytes(Value ?? "");

            public Credential ToCredential() => new Credential
            {
                Metadata = Metadata,
                Value = BinaryValue
            };
        }

        public class UserDataInfo
        {
            public List<UserData> DataList { get; set; }
        }

        public class UserValueInfo
        {
            public string User { get; set; }
            public string Value { get; set; }
        }
    }
}
