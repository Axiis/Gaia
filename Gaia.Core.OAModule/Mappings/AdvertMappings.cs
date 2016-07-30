using Axis.Jupiter.Europa.Mappings;
using Gaia.Core.Domain;

namespace Gaia.Core.OAModule.Mappings
{
    public class AdvertMapping: GaiaMap<Advert, long>
    {
        public AdvertMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);

            this.Property(e => e.MediaURI).IsMaxLength();
            this.Property(e => e.TargetDemographic).IsMaxLength();
            this.Property(e => e.ServiceTags).IsMaxLength();

            this.Ignore(e => e.Services);
            this.Ignore(e => e.IsExpired);
        }
    }

    public class AdvertHitMapping: GaiaMap<AdvertHit, long>
    {
        public AdvertHitMapping()
        {
            this.Property(e => e.OwnerId).HasMaxLength(250);
            this.HasRequired(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId);
            
            this.HasRequired(e => e.Advert)
                .WithMany()
                .HasForeignKey(e => e.AdvertId);
        }
    }
}
