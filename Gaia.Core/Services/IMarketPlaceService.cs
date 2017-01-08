using Axis.Luna;
using Gaia.Core.Domain.MarketPlace;
using Gaia.Core.Domain.Meta;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Services
{
    public interface IMarketPlaceService : IGaiaService, IUserContextAware
    {
        #region Merchant

        [Feature("system/MarketPlace/Merchant/ProductCategories/@get")]
        Operation<IEnumerable<ProductCategory>> GetProductCategories();


        [Feature("system/MarketPlace/Merchant/ServiceCategories/@get")]
        Operation<IEnumerable<ServiceCategory>> GetServiceCategories();

        [Feature("system/MarketPlace/Merchant/Products/@search")]
        Operation<SequencePage<ISearchableItem>> FindMerchantProducts(string searchString, int pageSize, long pageIndex = 0L);

        [Feature("system/MarketPlace/Merchant/Services/@search")]
        Operation<SequencePage<ISearchableItem>> FindMerchantServices(string searchString, int pageSize, long pageIndex = 0L);

        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current merchant. By default, this method will return the entire list of orders. Varying the values
        /// of the parameters
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        [Feature("system/MarketPlace/Merchant/Orders/@get")]
        Operation<SequencePage<Order>> GetMerchantOrders(long pageIndex = 0, int pageSize = -1);

        [Feature("system/MarketPlace/Merchant/Orders/@update")]
        Operation ModifyOrder(Order order);


        [Feature("system/MarketPlace/Merchant/Orders/@fulfill")]
        Operation FulfillOrder(Order order);


        [Feature("system/MarketPlace/Merchant/Services/@add")]
        Operation<long> AddService(Service service);

        [Feature("system/MarketPlace/Merchant/Services/@modify")]
        Operation ModifyService(Service service);


        [Feature("system/MarketPlace/Merchant/ServiceInterface/@add")]
        Operation<long> AddServiceInterface(ServiceInterface @interface);


        [Feature("system/MarketPlace/Merchant/Products/@add")]
        Operation<long> AddProduct(Product product);

        [Feature("system/MarketPlace/Merchant/Products/@modify")]
        Operation ModifyProduct(Product product);
        #endregion

        #region Customer
        [Feature("system/MarketPlace/Customer/Products/@search")]
        Operation<SequencePage<ISearchableItem>> FindCustomerProducts(string searchString, int pageSize, long pageIndex = 0L);

        [Feature("system/MarketPlace/Customer/Services/@search")]
        Operation<SequencePage<ISearchableItem>> FindCustomerServices(string searchString, int pageSize, long pageIndex = 0L);

        [Feature("system/MarketPlace/Customer/Lists/@get")]
        Operation<IEnumerable<string>> GetShoppingLists();


        [Feature("system/MarketPlace/Customer/Cart/@add")]
        Operation<long> AddToBasket(long itemId, ItemType type = ItemType.Product);


        [Feature("system/MarketPlace/Customer/Cart/@remove")]
        Operation RemoveFromBasket(long baskeItemId);


        [Feature("system/MarketPlace/Customer/List/@add")]
        Operation<long> AddToList(string listName, long itemId, ItemType type = ItemType.Product);


        [Feature("system/MarketPlace/Customer/List/@remove")]
        Operation RemoveFromList(string listName, long basketItemId);


        [Feature("system/MarketPlace/Customer/Cart/@pay")]
        Operation Checkout();



        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current customer. By default, this method will return the entire list of orders. Varying the values
        /// of the parameters
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        [Feature("system/MarketPlace/Customer/Orders/@get")]
        Operation<SequencePage<Order>> GetCustomerOrders(long pageIndex = 0, int pageSize = -1);
        #endregion

        #region Configure
        #endregion
    }
}
