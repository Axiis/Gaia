using Axis.Luna;
using Gaia.Core.Domain.MarketPlace;
using Gaia.Core.Domain.Meta;
using Gaia.Core.System;
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
        Operation<IEnumerable<ProductCategory>> GetProductCategories();


        Operation<IEnumerable<ServiceCategory>> GetServiceCategories();

        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current user. By default, this method will return the entire list of orders. Varying the values
        /// of the parameters
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        Operation<SequencePage<Order>> GetOrders(long pageIndex = 0, int pageSize = -1);

        Operation ModifyOrder(Order order);


        Operation FulfillOrder(Order order);


        Operation<long> AddService(Service service);


        Operation<long> AddServiceInterface(ServiceInterface @interface);


        Operation<long> AddProduct(Product product);
        #endregion

        #region Customer
        Operation<SequencePage<ISearchableItem>> FindItem(string searchString, string tags = null);


        Operation<long> AddToBasket(long itemId, SearchableItemType type = SearchableItemType.Product);


        Operation<long> AddToList(string listName, long itemId, SearchableItemType type = SearchableItemType.Product);


        Operation RemoveFromBasket(long baskeItemId);


        Operation RemoveFromList(string listName, long basketItemId);

        Operation Pay(long[] basketItemIds);
        #endregion

        #region Configure
        #endregion
    }
}
