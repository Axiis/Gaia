using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class UserReactionMapping: GaiaMap<UserReaction, long>
    {
        public UserReactionMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.Owner);

            this.Property(e => e.ContextType).HasMaxLength(500);

            this.Property(e => e.Reaction).HasMaxLength(250);
        }
    }
}
