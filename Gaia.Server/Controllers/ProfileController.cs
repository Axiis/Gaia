﻿using static Axis.Luna.Extensions.ExceptionExtensions;

using Axis.Jupiter;
using Axis.Pollux.Authentication;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Services;
using Gaia.Server.Controllers.ProfileModels;
using System.Linq;
using System.Web.Http;
using Axis.Luna.Extensions;
using System.Collections.Generic;

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
            => _profileService.RegisterUser(info.TargetUser, info.AccountType, info.Credentials.ToArray())
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPost]
        [Route("api/admin-profiles")]
        public IHttpActionResult RegisterAdminUser([FromBody]RegistrationInfo info)
            => _profileService.RegisterAdminUser(info.TargetUser, info.AccountType, info.Credentials.ToArray())
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/profiles/verificaftion")]
        public IHttpActionResult VerifyUserRegistration([FromBody]UserValueInfo userValue)
            => _profileService.VerifyUserRegistration(userValue.User, userValue.Value)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/profiles/data")]
        public IHttpActionResult AddData([FromBody]UserDataInfo data)
            => _profileService.AddData(data.DataList.ToArray())
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpDelete]
        [Route("api/profiles/data")]
        public IHttpActionResult RemoveData([FromBody]UserDataInfo dataNames)
            => _profileService.RemoveData(dataNames.DataList.Select(_d => _d.Name).ToArray())
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/profiles/archives")]
        public IHttpActionResult ArchiveUser([FromBody]UserValueInfo userValue)
            => _profileService.ArchiveUser(userValue.User)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPost]
        [Route("api/profiles/activation")]
        public IHttpActionResult CreateUserActivationVerification([FromBody]UserValueInfo userValue)
            => _profileService.CreateUserActivationVerification(userValue.User)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/profiles/activation")]
        public IHttpActionResult VerifyUserActivation([FromBody]UserValueInfo userValue)
            => _profileService.VerifyUserActivation(userValue.User, userValue.Value)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpGet]
        [Route("api/profiles/discovered")]
        public IHttpActionResult Discover()
            => _profileService.Discover()
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;
    }



    namespace ProfileModels
    {
        public class RegistrationInfo
        {
            public string TargetUser { get; set; }
            public AccountType AccountType { get; set; }
            public List<Credential> Credentials { get; set; }
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
