using Axis.Pollux.Identity.Principal;
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

        /// <summary>
        /// Represents the merchant that owns the product
        /// </summary>
        public User Owner { get; set; }


        public ICollection<BlobAttachment> Images { get; set; } = new HashSet<BlobAttachment>(); //ignore
        public ICollection<BlobAttachment> Videos { get; set; } = new HashSet<BlobAttachment>(); //ignore
    }

    public enum ProductStatus
    {
        Reviewing,
        Published
    }

}
