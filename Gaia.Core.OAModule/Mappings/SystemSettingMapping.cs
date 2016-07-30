using Axis.Jupiter.Europa;
using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class SystemSettingMapping: GaiaMap<SystemSetting, long>
    {
        public SystemSettingMapping()
        {
            this.Property(e => e.BinaryData).IsMaxLength();
            this.Property(e => e.StringData).IsMaxLength();
            this.Property(e => e.Name).IsIndex("SystemSettingName", true);
        }
    }
}
