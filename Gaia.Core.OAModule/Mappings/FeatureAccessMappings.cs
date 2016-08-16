using Axis.Jupiter.Europa;
using Axis.Jupiter.Europa.Mappings;
using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class FeatureAccessDescriptorMapping : GaiaMap<FeatureAccessDescriptor, long>
    {
        public FeatureAccessDescriptorMapping()
        {
            this.Property(e => e.AccessDescriptor).IsMaxLength();
            this.Property(e => e.AccessProfileCode).IsIndex("FeatureAccessProfileCodeIndex", false).HasMaxLength(250);
        }
    }
    public class FeatureAccessProfileMapping : GaiaMap<FeatureAccessProfile, long>
    {
        public FeatureAccessProfileMapping()
        {
            this.Property(e => e.AccessCode).IsIndex("FeatureAccessCodeIndex", true).HasMaxLength(250);
            this.Property(e => e.Description).IsMaxLength();
            this.Property(e => e.Title).HasMaxLength(250);

            this.Ignore(e => e.AccessDescriptors);
        }
    }
}
