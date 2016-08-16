using Axis.Jupiter.Europa;
using Gaia.Core.Domain;

namespace Gaia.Core.OAModule.Mappings
{
    public class SystemSettingMapping: GaiaMap<SystemSetting, long>
    {
        public SystemSettingMapping()
        {
            this.Property(e => e.Data).IsMaxLength();
            this.Property(e => e.Name)
                .HasMaxLength(400)
                .IsIndex("SystemSettingName", true);
        }
    }
}
