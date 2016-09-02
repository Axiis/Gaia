using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class RatingMapping: GaiaMap<Rating, long>
    {
        public RatingMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.ContextType).HasMaxLength(500);
        }
    }
}
