using Axis.Luna.Extensions;
using System.Web.Http;

namespace Gaia.Server.Controllers.MVC
{
    public class ViewServerController : ApiController
    {
        [HttpGet]
        [Route("xviews/{viewPath}")]
        public IHttpActionResult GetView(string viewPath) 
            => Render($"~/views/{viewPath.ThrowIfNull()}");

        private IHttpActionResult Render(string viewPath)
        {
            //find the view page, apply interpolation, and send it to the response
            return this.Content<string>(System.Net.HttpStatusCode.OK, "interpolated view returned");
        }
    }
}