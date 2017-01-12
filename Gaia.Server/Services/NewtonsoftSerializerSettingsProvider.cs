using Gaia.Core.Services;
using Gaia.Server.Utils;

namespace Gaia.Server.Services
{
    public class NewtonsoftSerializerSettingsProvider : ISerializerSettingsProviderService
    {
        public object GetSerializerSettings() => Constants.DefaultJsonSerializerSettings;
    }
}