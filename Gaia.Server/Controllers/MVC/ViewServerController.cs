using Axis.Luna;
using Axis.Luna.Extensions;
using Gaia.Core;
using Gaia.Core.Services;
using Gaia.Server.Utils;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using System.Web.Mvc;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;


namespace Gaia.Server.Controllers.MVC
{
    public class ViewServerController : Controller
    {
        public static readonly Regex FilePart = new Regex(@"^[^\#\?]+(?=([\?\#]|$))");

        private IUserLocator _userLocator = new MVCUserLocator();

        public ViewServerController()
        {
        }


        [HttpGet, Route("view-server/{*viewPath}")]
        public ActionResult GetView(string viewPath) 
            => Render($"~/views/{viewPath.ThrowIfNull()}");

        /// <summary>
        /// </summary>
        /// <param name="viewPath"></param>
        /// <returns></returns>
        private ActionResult Render(string viewPath)
            => Operation.Try(() =>
            {
                //if the viewpath is within the "secured" folder, make sure there is a logged in user
                if (viewPath.ToLower().StartsWith("~/views/secured") &&
                    (_userLocator.CurrentUser() ?? DomainConstants.GuestAccount) == DomainConstants.GuestAccount)
                    return //new HttpStatusCodeResult(HttpStatusCode.Unauthorized, "Unauthorized Resource access detected");
                           Redirect("/view-server/login/shell");

                else return FilePart.Match(viewPath)
                    .PipeIf(_match => _match.Success, _match =>
                    {
                        var finfo = new FileInfo(HostingEnvironment.MapPath(_match.Value));
                        if (finfo.Extension == string.Empty)
                            return finfo.Directory.EnumerateFiles().FirstOrDefault(_f => _f.Name.StartsWith(finfo.Name));
                        else return finfo;
                    })
                    .PipeOrDefault(_finfo => _finfo.Extension.StartsWith(".htm") ? Html(_finfo) : Razor(viewPath))
                    .ThrowIfNull("could not load the view");
            })
            .Instead(opr => new HttpStatusCodeResult(HttpStatusCode.InternalServerError))
            .Result;

        private ActionResult Html(FileInfo finfo)
            => Operation.Try(() => finfo.OpenRead()
                .Pipe(_s => new StreamReader(_s))
                .Using(_sr => _sr.ReadToEnd())
                .Pipe(_content => Content(_content, "text/html").As<ActionResult>()))
                .Instead(opr => new HttpStatusCodeResult(HttpStatusCode.InternalServerError))
                .Result;

        private ActionResult Razor(string viewPath)
            => View($"{viewPath}{(viewPath.ToLower().EndsWith(".cshtml") ? "" : ".cshtml")}");
    }
}