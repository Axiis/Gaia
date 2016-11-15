using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Service: GaiaEntity<long>, ISearchableItem
    {
        public static readonly string TransactionIdFormat = "S-X00-0XX0-0XX00X";
        public string TransactionId { get; set; } = IdGenerator.NewId(TransactionIdFormat);

        public string Title { get; set; }
        public string Description { get; set; }
        public ServiceStatus Status { get; set; }
        public decimal Cost { get; set; }
        public Product Product { get; set; } //only ever set for Product-pickup services

        public string Tags { get; set; }

        public ItemType ItemType => ItemType.Service; //ignore in db

        //public PaymentChannel PaymentChannel { get; set; }

        public ICollection<ServiceInterface> Inputs { get; set; }  = new HashSet<ServiceInterface>();
        public ICollection<ServiceInterface> Outputs { get; set; } = new HashSet<ServiceInterface>();
    }

    public enum ServiceStatus
    {
        Available,
        Unavailable,
        Suspended
    }
}
