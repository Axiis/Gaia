using Axis.Pollux.Identity.Principal;

namespace Gaia.Core.Domain.MarketPlace
{
    public class ShoppingListItem: GaiaEntity<long>
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
        public string ListName
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public int Quantity
        {
            get { return get<int>(); }
            set { set(ref value); }
        }
    }
}
