using Gaia.Core.Domain.MarketPlace;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.OAModule.Mappings.MarketPlace
{
    public class OrderAggregateMap: GaiaMap<OrderAggregate, long>
    {
        public OrderAggregateMap()
        {
            Ignore(_e => _e.TotalAmount);
        }
    }

    public class OrderMap: GaiaMap<Order, long>
    {
        public OrderMap()
        {
            this.Property(e => e.TransactionId)
                .HasMaxLength(22);

            this.HasOptional(e => e.Next).WithMany().HasForeignKey(e => e.NextId);
        }
    }

    public class ProductMap : GaiaMap<Product, long>
    {
        public ProductMap()
        {
            this.Property(e => e.TransactionId)
                .HasMaxLength(17);

            this.Property(e => e.Description)
                .HasColumnType("nText");

            this.Ignore(e => e.ItemType);
            this.Ignore(e => e.Images);
            this.Ignore(e => e.Videos);
        }
    }

    public class ServiceMap : GaiaMap<Service, long>
    {
        public ServiceMap()
        {
            this.Property(e => e.TransactionId)
                .HasMaxLength(17);

            this.Property(e => e.Description)
                .HasColumnType("nText");

            this.Ignore(e => e.ItemType);
        }
    }

    public class ServiceDataContractMap : GaiaMap<ServiceDataContract, long>
    {
        public ServiceDataContractMap()
        {
        }
    }

    public class ServiceInterfaceMap : GaiaMap<ServiceInterface, long>
    {
        public ServiceInterfaceMap()
        {
        }
    }


    public class ShoppingCartItemMap : GaiaMap<ShoppingCartItem, long>
    {
        public ShoppingCartItemMap()
        {
        }
    }
    public class ShoppingListItemMap : GaiaMap<ShoppingListItem, long>
    {
        public ShoppingListItemMap()
        {
        }
    }
}
