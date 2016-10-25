using Axis.Jupiter;
using Gaia.Core.Services;
using System.Linq;
using System.Web.Http;
using Axis.Luna.Extensions;

using static Axis.Luna.Extensions.ExceptionExtensions;
using Accounts = Gaia.Core.Domain.Accounts;

namespace Gaia.Server.Controllers
{
    public class UserAccountsController : ApiController
    {
        private IUserAccountsService _accountService = null;
        private IDataContext _dataStore = null; //<-- for specialized query scenarios where i'll have to return business objects to the client

        public UserAccountsController(IUserAccountsService accountsService, IDataContext dataService)
        {
            ThrowNullArguments(() => accountsService, () => dataService);

            this._accountService = accountsService;
            this._dataStore = dataService;
        }


        #region service account
        [HttpGet]
        [Route("api/profiles/service-account")]
        public IHttpActionResult GetServiceAccounts()
            => _accountService.GetServiceAccounts()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/profiles/service-account")]
        public IHttpActionResult ModifyServiceAccounts([FromBody]Accounts.Service data)
            => _accountService.ModifyServiceAccount(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/profiles/service-account")]
        public IHttpActionResult AddServiceAccounts([FromBody]Accounts.Service data)
            => _accountService.AddServiceAccount(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpDelete]
        [Route("api/profiles/service-account")] //<-- http://abcd.xyz/api/profiles/contact-data/?ids=1,5,3,2,76,etc
        public IHttpActionResult RemoveServiceAccount([FromUri]string ids)
            => _accountService.RemoveServiceAccount(ids?.Split(',').Select(_id => long.Parse(_id)).ToArray() ?? new long[0])
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion

        #region farm account
        [HttpGet]
        [Route("api/profiles/farm-account")]
        public IHttpActionResult GetFarmAccounts()
            => _accountService.GetFarmAccounts()
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPut]
        [Route("api/profiles/farm-account")]
        public IHttpActionResult ModifyFarmAccount([FromBody]Accounts.Farm data)
            => _accountService.ModifyFarmAccount(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpPost]
        [Route("api/profiles/farm-account")]
        public IHttpActionResult AddFarmAccounts([FromBody]Accounts.Farm data)
            => _accountService.AddFarmAccount(data)
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;

        [HttpDelete]
        [Route("api/profiles/farm-account")] //<-- http://abcd.xyz/api/profiles/contact-data/?ids=1,5,3,2,76,etc
        public IHttpActionResult RemoveFarmAccount([FromUri]string ids)
            => _accountService.RemoveFarmAccount(ids?.Split(',').Select(_id => long.Parse(_id)).ToArray() ?? new long[0])
                .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                .Result;
        #endregion
    }
}
