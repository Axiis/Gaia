using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class UserAccessProfileMapping: GaiaMap<UserAccessProfile, long>
    {
        public UserAccessProfileMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.Owner);

            this.Property(e => e.AccessProfileCode).HasMaxLength(250);

            this.Ignore(e => e.FeatureProfile);
        }
    }
}
