using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class NotificationMapping : GaiaMap<Notification, long>
    {
        public NotificationMapping()
        {
            this.Property(e => e.TargetUserId).HasMaxLength(250);
            this.HasRequired(e => e.TargetUser)
                .WithMany()
                .HasForeignKey(e => e.TargetUserId);

            this.Property(e => e.Title).HasMaxLength(500);
            this.Property(e => e.Message).IsMaxLength();
            this.Property(e => e.ContextType).HasMaxLength(500);
        }
    }
}
