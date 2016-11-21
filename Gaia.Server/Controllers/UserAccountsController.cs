using Axis.Jupiter;
using Gaia.Core.Services;
using System.Linq;
using System.Web.Http;
using Axis.Luna.Extensions;

using static Axis.Luna.Extensions.ExceptionExtensions;
using Gaia.Core.Domain;

namespace Gaia.Server.Controllers
{
    public class UserAccountsController : ApiController
    {
        private IProfileService _profileService = null;
        private IDataContext _dataStore = null; //<-- for specialized query scenarios where i'll have to return business objects to the client

        public UserAccountsController(IProfileService profileService, IDataContext dataService)
        {
            ThrowNullArguments(() => profileService, () => dataService);

            this._profileService = profileService;
            this._dataStore = dataService;
        }

        #region farm account
        [HttpGet]
        [Route("api/profiles/farm-account")]
        public IHttpActionResult GetFarmAccounts()
            => _profileService.GetFarmAccounts()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/profiles/farm-account")]
        public IHttpActionResult ModifyFarmAccount([FromBody]Farm data)
            => _profileService.ModifyFarmAccount(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/profiles/farm-account")]
        public IHttpActionResult AddFarmAccounts([FromBody]Farm data)
            => _profileService.AddFarmAccount(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpDelete]
        [Route("api/profiles/farm-account")] //<-- http://abcd.xyz/api/profiles/contact-data/?ids=1,5,3,2,76,etc
        public IHttpActionResult RemoveFarmAccount([FromUri]string ids)
            => _profileService.RemoveFarmAccount(ids?.Split(',').Select(_id => long.Parse(_id)).ToArray() ?? new long[0])
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion
    }
}
