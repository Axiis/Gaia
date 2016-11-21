using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Product: GaiaEntity<long>, ISearchableItem
    {
        public static readonly string TransactionIdFormat = "P-X00-00X0-XXX00X";
        public string TransactionId { get; set; } = IdGenerator.NewId(TransactionIdFormat);

        public string Title { get; set; }
        public string Description { get; set; }

        public int StockCount { get; set; }
        public decimal Cost { get; set; }

        public ProductStatus Status { get; set; }

        public string Tags { get; set; }

        public ItemType ItemType => ItemType.Product; //ignore in db


        public ICollection<Blob> Images { get; set; } = new HashSet<Blob>(); //ignore
        public ICollection<Blob> Videos { get; set; } = new HashSet<Blob>(); //ignore
    }

    public enum ProductStatus
    {
        Published,
        Reviewing
    }

}
