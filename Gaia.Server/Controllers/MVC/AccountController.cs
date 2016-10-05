using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Axis.Luna.Extensions;
using System.Net;
using Axis.Luna;
using Newtonsoft.Json;
using Gaia.Core.Services;
using Gaia.Server.Utils;

namespace Gaia.Server.Controllers.MVC
{
    public class AccountController : Controller
    {
        private MVCUserLocator _userLocator = new MVCUserLocator();


        [HttpPost, Route("auth/login"), ValidateAntiForgeryToken]
        public ActionResult Login(string userName, string password)
            => Operation.Try(() =>
            {
                return new WebClient().Using(client =>
               {
                   client.Headers.Add(HttpRequestHeader.Accept, "application/json");
                   client.Headers.Add(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded");

                   var creds = Uri.EscapeUriString($"grant_type=password&username={userName}&password={password}");
                   string response = client.UploadString(new Uri($"{Request.Url.Scheme}://{Request.Url.Authority}/Tokens"), "POST", creds);

                   _userLocator.Signin(userName);

                   return response;
               });
            })
            .Then(opr => new ContentResult
            {
                Content = JsonConvert.SerializeObject(opr),
                ContentType = "application/json"
            })
            .Instead(opr =>
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return new ContentResult
                {
                    Content = JsonConvert.SerializeObject(opr),
                    ContentType = "application/json"
                };
            })
            .Result;

        [HttpPut, Route("auth/logout/{userName}")]
        public ActionResult Logout(string userName)
            => Operation.Try(() => _userLocator.Signout(userName))
            .Then(opr => new ContentResult
            {
                Content = JsonConvert.SerializeObject(opr),
                ContentType = "application/json"
            })
            .Instead(opr =>
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return new ContentResult
                {
                    Content = JsonConvert.SerializeObject(opr),
                    ContentType = "application/json"
                };
            })
            .Result;
    }
}