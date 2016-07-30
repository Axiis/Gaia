using Gaia.Core.Domain;

namespace Gaia.Core.OAModule.Mappings
{
    public class ForumThreadMapping : GaiaMap<ForumThread, long>
    {
        public ForumThreadMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.Title).HasMaxLength(500);
        }
    }

    public class ForumTopicMapping : GaiaMap<ForumTopic, long>
    {
        public ForumTopicMapping()
        {
            this.Property(e => e.Title).HasMaxLength(500);
        }
    }

    public class ForumThreadWatchMapping: GaiaMap<ForumThreadWatch, long>
    {
        public ForumThreadWatchMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);
        }
    }
}
