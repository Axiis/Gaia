using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;

namespace Gaia.Core.Services
{
    public class SystemSettingService : ISystemSettingsService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }


        public SystemSettingService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation ModifySetting(string settingName, string settingValue)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var store = DataContext.Store<SystemSetting>();
                store.Query
                     .FirstOrDefault(st => st.Name == settingName)
                     .ThrowIfNull("could not find setting")
                     .Do(st =>
                     {
                         st.Data = settingValue;
                         store.Modify(st, true);
                     });
            });

        public Operation<IEnumerable<SystemSetting>> GetSettings()
            => FeatureAccess.Guard(UserContext, () => DataContext.Store<SystemSetting>().Query.AsEnumerable());
    }
}
