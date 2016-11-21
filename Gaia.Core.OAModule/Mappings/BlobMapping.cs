using Axis.Jupiter.Europa;
using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings
{
    public class BlobMapping: GaiaMap<Blob, long>
    {
        public BlobMapping()
        {
            this.Property(e => e.ContextId).IsIndex("BlobContextId", false);
            this.Property(e => e.Context)
                .HasMaxLength(400)
                .IsIndex("BlobContext", false);
        }
    }
}
