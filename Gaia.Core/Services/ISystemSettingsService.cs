using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface ISystemSettingsService: IUserContextAware
    {

        [Feature("system/Settings/@modify")]
        Operation ModifySetting(string settingName, string settingValue);


        [Feature("system/Settings/@get-settings")]
        Operation<IEnumerable<SystemSetting>> GetSettings();
    }
}
