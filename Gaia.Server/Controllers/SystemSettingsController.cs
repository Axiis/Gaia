using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Gaia.Core.Services;
using System.Web.Http;
using Axis.Luna;

namespace Gaia.Server.Controllers
{
    public class SystemSettingsController : ApiController
    {
        private ISystemSettingsService _systemSettingsService = null;

        public SystemSettingsController(ISystemSettingsService systemSettingsService)
        {
            ThrowNullArguments(() => systemSettingsService);

            this._systemSettingsService = systemSettingsService;
        }

        [HttpPut]
        [Route("api/system-settings")]
        public IHttpActionResult ModifySetting([FromBody]SettingsModels.SystemSetting settings)
            => Operation.Try(() => settings.ToDomain())
                .Then(opr => _systemSettingsService.ModifySetting(opr.Result.Name, opr.Result.Data))
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;

        [HttpGet]
        [Route("api/system-settings")]
        public IHttpActionResult GetSettings()
            => _systemSettingsService.GetSettings()
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;
    }

    namespace SettingsModels
    {
        public class SystemSetting
        {
            public string Name { get; set; }
            public string Value { get; set; }

            public Core.Domain.SystemSetting ToDomain() => new Core.Domain.SystemSetting
            {
                Name = Name,
                Data = Value
            };
        }
    }
}
