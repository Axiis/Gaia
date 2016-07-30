using Axis.Luna;
using Gaia.Core.System;
using Gaia.Core.Utils;

namespace Gaia.Core.Services
{
    public interface ISystemSettingsService: IUserContextAware
    {

        [Feature("system/Settings/@modify-text")]
        Operation ModifySetting(string settingName, string settingValue);


        [Feature("system/Settings/@modify-binary")]
        Operation ModifySetting(string settingName, byte[] settingValue);
    }
}
