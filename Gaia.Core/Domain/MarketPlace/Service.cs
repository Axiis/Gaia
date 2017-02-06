using Axis.Luna;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Service: GaiaEntity<long>, ISearchableItem
    {
        public static readonly string TransactionIdFormat = "S-X00-0XX0-0XX00X";
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
        public ServiceStatus Status
        {
            get { return get<ServiceStatus>(); }
            set { set(ref value); }
        }
        public decimal Cost
        {
            get { return get<decimal>(); }
            set { set(ref value); }
        }
        public Product Product //only ever set for Product-pickup services
        {
            get { return get<Product>(); }
            set { set(ref value); }
        } 

        public string Tags
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public ItemType ItemType => ItemType.Service; //ignore in db

        //public PaymentChannel PaymentChannel { get; set; }

        /// <summary>
        /// Represents the merchant that owns the product
        /// </summary>
        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public ICollection<ServiceInterface> Inputs { get; set; }  = new HashSet<ServiceInterface>();
        public ICollection<ServiceInterface> Outputs { get; set; } = new HashSet<ServiceInterface>();
        public ICollection<BlobRef> Images { get; set; } = new HashSet<BlobRef>(); //ignore

        public Service()
        {
            this.TransactionId = IdGenerator.NewId(TransactionIdFormat);
        }
    }

    public enum ServiceStatus
    {
        Unavailable,
        Available,
        Suspended
    }
}
