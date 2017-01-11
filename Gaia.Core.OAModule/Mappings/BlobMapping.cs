using Axis.Jupiter.Europa;
using Gaia.Core.Domain;

namespace Gaia.Core.OAModule.Mappings
{
    public class BlobMapping: GaiaMap<BlobAttachment, long>
    {
        public BlobMapping()
        {
            this.Property(e => e.ContextId).IsIndex("BlobContextId", false);
            this.Property(e => e.Context)
                .HasMaxLength(400)
                .IsIndex("BlobContext", false);

            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);
        }
    }
}
