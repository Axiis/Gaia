using Axis.Jupiter.Europa;
using Axis.Jupiter.Europa.Mappings;
using Gaia.Core.Domain;

namespace Gaia.Core.OAModule.Mappings
{
    public class PostMapping: GaiaMap<Post, long>
    {
        public PostMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.Title).HasMaxLength(500);
            this.Property(e => e.Message).IsMaxLength();
            this.Property(e => e.TargetDemographic).IsMaxLength();
            this.Property(e => e.ParentPostId).IsIndex("History", false);
        }
    }
}
