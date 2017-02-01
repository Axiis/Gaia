using Axis.Jupiter.Europa;
using Gaia.Core.Domain;

namespace Gaia.Core.OAModule.Mappings
{
    public class ContextVerificationMapping : GaiaMap<ContextVerification, long>
    {
        public ContextVerificationMapping()
        {
            this.Property(e => e.UserId).HasMaxLength(250);
            this.HasRequired(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId);

            this.Property(e => e.VerificationToken)
                .IsIndex("VerificationToken", false)
                .HasMaxLength(100);
            this.Property(e => e.Context)
                .HasMaxLength(250);
        }
    }
}
