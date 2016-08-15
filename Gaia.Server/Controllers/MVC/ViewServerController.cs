using Axis.Luna.Extensions;
using Gaia.Core.Services;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Hosting;
using System.Web.Http;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;

namespace Gaia.Server.Controllers.MVC
{
    public class ViewServerController : ApiController
    {
        private INotificationService _notificationService = null;

        public ViewServerController(INotificationService notificationService)
        {
            ThrowNullArguments(() => notificationService);

            this._notificationService = notificationService;
        }

        [HttpGet]
        [Route("xviews/{viewPath}")]
        public HttpResponseMessage GetView(string viewPath) 
            => Render($"~/views/{viewPath.ThrowIfNull()}");

        private HttpResponseMessage Render(string viewPath)
        {
            var mapped = HostingEnvironment.MapPath(viewPath);
            var content = new FileInfo(mapped)
                .OpenRead()
                .Pipe(strm => new StreamReader(strm))
                .Using(rdr => rdr.ReadToEnd());
            
            var response = new HttpResponseMessage();
            response.Content = new StringContent(content);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return response;
        }
    }
}