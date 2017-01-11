using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class ShoppingCartItem: GaiaEntity<long>
    {
        public ItemType ItemType
        {
            get { return get<ItemType>(); }
            set { set(ref value); }
        }
        public long ItemId
        {
            get { return get<long>(); }
            set { set(ref value); }
        }
        public User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public int Quantity
        {
            get { return get<int>(); }
            set { set(ref value); }
        }
    }
}
