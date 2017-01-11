using Axis.Pollux.Identity.Principal;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class OrderAggregate: GaiaEntity<long>
    {
        public static readonly string TransactionIdFormat = "G-X00-0000-XXX00X-X0X0";
        public string TransactionId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public DateTime TimeStamp
        {
            get { return get<DateTime>(); }
            set { set(ref value); }
        }

        public decimal TotalAmount => Orders?.Aggregate(0m, (acc, next) => acc + next.Amount) ?? 0m;

        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public ICollection<Order> Orders { get; set; } = new HashSet<Order>();

        public OrderAggregate()
        {
            this.TransactionId = IdGenerator.NewId(TransactionIdFormat);
        }
    }
}
