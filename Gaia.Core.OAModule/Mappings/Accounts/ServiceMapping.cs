using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings.Accounts
{
    public class ServiceMapping: GaiaMap<Domain.Accounts.Service, long>
    {
        public ServiceMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.Description).HasColumnType("nText");
        }
    }
}
