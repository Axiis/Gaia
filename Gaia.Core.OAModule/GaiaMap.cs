using Axis.Jupiter.Europa.Mappings;
using Gaia.Core.Domain;

namespace Gaia.Core.OAModule
{
    public class GaiaMap<Entity, Key>: BaseMap<Entity>
    where Entity: GaiaEntity<Key>
    {
        protected GaiaMap() : this(true)
        { }

        protected GaiaMap(bool useDefaultTable): base(useDefaultTable)
        {
            //configure the primary key
            this.HasKey(e => e.EntityId);

            this.Property(e => e.ModifiedBy).HasMaxLength(250);
            this.Property(e => e.CreatedBy).HasMaxLength(250);

        }
    }
}
