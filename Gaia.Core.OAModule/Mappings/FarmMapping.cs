using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings.Accounts
{
    public class FarmMapping: GaiaMap<Farm, long>
    {
        public FarmMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.Description).HasColumnType("nText");
            this.Property(e => e.GeoData).HasColumnType("nText"); //<-- see GeoArea/GeoLocation, etc
        }
    }
}
