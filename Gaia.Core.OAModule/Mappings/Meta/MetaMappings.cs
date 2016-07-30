using Gaia.Core.Domain.Meta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings.Meta
{
    public class ServiceCategoryMapping : GaiaMap<ServiceCategory, int>
    {
        public ServiceCategoryMapping()
        {
            this.Property(e => e.Title).HasMaxLength(500);
            this.Property(e => e.Description).IsMaxLength();
        }
    }

    public class ProductCategoryMapping : GaiaMap<ProductCategory, int>
    {
        public ProductCategoryMapping()
        {
            this.Property(e => e.Title).HasMaxLength(500);
            this.Property(e => e.Description).IsMaxLength();
        }
    }

    public class FeatureURIMapping : GaiaMap<FeatureURI, int>
    { 
        public FeatureURIMapping()
        {
            this.Property(e => e.Name).HasMaxLength(500);
            this.Property(e => e.URI).IsMaxLength();
        }
    }
}
