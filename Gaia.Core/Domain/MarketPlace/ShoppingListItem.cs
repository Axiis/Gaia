using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class ShoppingListItem: GaiaEntity<long>
    {
        public ItemType ItemType { get; set; }
        public long ItemId { get; set; }
        public User Owner { get; set; }
        public string ListName { get; set; }

        public int Quantity { get; set; }
    }
}
