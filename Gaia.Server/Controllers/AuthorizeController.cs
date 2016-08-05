using Axis.Pollux.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Gaia.Server.Controllers
{

    /// <summary>
    /// Turns out the purpose of this class is being taken care of by the AuthorizationServer. I just need to find out what 
    /// methods/concepts on that class map to the concepts/methods here, then i can discard this class
    /// </summary>
    //public class AuthorizeController : ApiController
    //{
    //    /// <summary>
    //    /// this action represents an instruction to authenticate all credentials provided, and return
    //    /// a valid "Authorization-Token"
    //    /// </summary>
    //    /// <param name="credentials">object containing all credentials to be authenticated against the username given</param>
    //    /// <returns>returns an appropriate WebApi action, with an Authorization-Token if successful.</returns>
    //    [HttpPost]
    //    [Route("/Authenticate")]
    //    public IHttpActionResult AuthenticateCredentials(Models.AuthenticationCredentials credentials)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    /// <summary>
    //    /// Verifis the 
    //    /// </summary>
    //    /// <returns></returns>
    //    [HttpPost]
    //    [Route("/AuthrizeThirdparty/{authKey}")]
    //    public IHttpActionResult AuthorizeThirdparty(string authKey)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <returns></returns>
    //    [Route]
    //    public IHttpActionResult GenerateThirdpartyAuthorizationKey()
    //    {
    //        throw new NotImplementedException();
    //    }
    //}



    //namespace Models
    //{
    //    public class AuthenticationCredentials
    //    {
    //        public string UserId { get; set; }

    //        public Credential[] Credentials { get; set; }
    //    }
    //}
}
