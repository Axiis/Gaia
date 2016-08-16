using Axis.Luna;
using Axis.Luna.Extensions;
using Gaia.Core.Services;
using System.IO;
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


        private INotificationService _notificationService = null;

        public ViewServerController(INotificationService notificationService)
        {
            ThrowNullArguments(() => notificationService);

            this._notificationService = notificationService;
        }

        [HttpGet]
        [Route("view-server/{viewPath}")]
        public ActionResult GetView(string viewPath) 
            => Render($"~/views/{viewPath.ThrowIfNull()}");

        /// <summary>
        /// </summary>
        /// <param name="viewPath"></param>
        /// <returns></returns>
        private ActionResult Render(string viewPath)
            => Operation.Try(() => FilePart.Match(viewPath)
                .PipeIf(_match => _match.Success, _match => new FileInfo(HostingEnvironment.MapPath(_match.Value)))
                .PipeOrDefault(_finfo => _finfo.Extension.StartsWith(".html") ? Html(_finfo) : Razor(_finfo))
                .Instead(opr => new HttpStatusCodeResult(HttpStatusCode.InternalServerError))
                .Result;
                //.PipeOrDefault(_finfo => new { fileInfo = _finfo, content = _finfo.OpenRead().Pipe(_s => new StreamReader(_s)).Using(_sr => _sr.ReadToEnd()) })
                //.PipeOrDefault(_cinfo => string.Compare(_cinfo.fileInfo.Extension, "cshtml", true) == 0 ? Razor(_cinfo.content) : _cinfo.content)
                //.PipeOrDefault(_content => new HttpResponseMessage
                //{
                //    Content = new StringContent(_content, Encoding.UTF8, "text/html"),
                //    StatusCode = System.Net.HttpStatusCode.OK,
                //    ReasonPhrase = "Success"
                //}))
                //.Instead(opr => new HttpResponseMessage
                //{
                //    Content = new StringContent("An error occured while loading the page", Encoding.UTF8, "text/html"),
                //    StatusCode = System.Net.HttpStatusCode.BadRequest,
                //    ReasonPhrase = "Bad Request"
                //})
                //.Result;

        private ActionResult Html(FileInfo finfo)
        {

        }
        private ActionResult Razor(FileInfo finfo)
        {

        }
    }
}