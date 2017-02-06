using Axis.Luna;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Product: GaiaEntity<long>, ISearchableItem
    {
        public static readonly string TransactionIdFormat = "P-X00-00X0-XXX00X";
        public string TransactionId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string Title
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public string Description
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public int StockCount
        {
            get { return get<int>(); }
            set { set(ref value); }
        }
        public decimal Cost
        {
            get { return get<decimal>(); }
            set { set(ref value); }
        }

        public ProductStatus Status
        {
            get { return get<ProductStatus>(); }
            set { set(ref value); }
        }

        public string Tags
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public ItemType ItemType => ItemType.Product; //ignore in db

        /// <summary>
        /// Represents the merchant that owns the product
        /// </summary>
        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }


        public ICollection<BlobRef> Images { get; set; } = new HashSet<BlobRef>(); //ignore

        public Product()
        {
            this.TransactionId = IdGenerator.NewId(TransactionIdFormat);
        }
    }

    public enum ProductStatus
    {
        Reviewing,
        Published
    }

}
