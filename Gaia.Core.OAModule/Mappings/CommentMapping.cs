using Gaia.Core.Domain;

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
