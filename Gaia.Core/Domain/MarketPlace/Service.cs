using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class Service: GaiaEntity<long>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public ServiceStatus Status { get; set; }
        public decimal Cost { get; set; }

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
