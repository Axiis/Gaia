using Gaia.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class AggregateOrder: GaiaEntity<long>
    {
        public static readonly string TransactionIdFormat = "G-X00-0000-XXX00X-X0X0";
        public string TransactionId { get; set; } = IdGenerator.NewId(TransactionIdFormat);

        public DateTime TimeStamp { get; set; }

        public decimal TotalAmount => Orders?.Aggregate(0m, (acc, next) => acc + next.Amount) ?? 0m;

        public ICollection<Order> Orders { get; set; } = new HashSet<Order>();
    }
}
