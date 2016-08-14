using Axis.Jupiter.Europa.Mappings;
using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class CommentMapping: GaiaMap<Comment, long>
    {
        public CommentMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.Text).IsMaxLength();
            this.Property(e => e.ContextType).HasMaxLength(500);
        }
    }
}
