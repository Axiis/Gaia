using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Product: GaiaEntity<long>
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public int StockCount { get; set; }
        public decimal Cost { get; set; }

        public ProductStatus Status { get; set; }

        public ICollection<Blob>
    }

    public enum ProductStatus
    {
        Published,
        Reviewing
    }

}
