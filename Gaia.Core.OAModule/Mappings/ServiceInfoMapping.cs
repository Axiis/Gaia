using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    //public class ServiceInfoMapping: GaiaMap<ServiceInfo, long>
    //{
    //    public ServiceInfoMapping()
    //    {
    //        this.Property(e => e.OwnerId).HasMaxLength(250);
    //        this.HasRequired(e => e.Owner)
    //            .WithMany()
    //            .HasForeignKey(e => e.OwnerId);

    //        this.HasRequired(e => e.Category)
    //            .WithMany();

    //        this.Property(e => e.ServiceName).HasMaxLength(500);
    //        this.Property(e => e.Description).IsMaxLength();
    //        this.Property(e => e.PhotoLinks).IsMaxLength();
    //        this.Property(e => e.VideoLinks).IsMaxLength();
    //    }
    //}
}
