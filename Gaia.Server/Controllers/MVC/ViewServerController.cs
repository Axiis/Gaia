using Axis.Luna.Extensions;
using System.Web.Mvc;

namespace Gaia.Server.Controllers.MVC
{
    public class ViewServerController : Controller
    {
        [HttpGet]
        [Route("view-server/{viewPath}")]
        public ViewResult GetView(string viewPath) 
            => View($"~/views/{viewPath.ThrowIfNull().TrimEnd(".cshtml")}.cshtml");
    }
}