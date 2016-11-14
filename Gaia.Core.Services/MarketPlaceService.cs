using Axis.Jupiter;
using Axis.Luna;
using Gaia.Core.Domain.MarketPlace;
using Gaia.Core.Domain.Meta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Axis.Luna.Extensions.ExceptionExtensions;

namespace Gaia.Core.Services
{
    public class MarketPlaceService: IMarketPlaceService
    {

        public IUserContextService UserContext { get; private set; }

        public IDataContext DataContext { get; private set; }


        public MarketPlaceService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => UserContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }


        #region Merchant
        public Operation<IEnumerable<ProductCategory>> GetProductCategories()
        {

        }

        public Operation<IEnumerable<ServiceCategory>> GetServiceCategories()
        {

        }

        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current user. By default, this method will return the entire list of orders. Varying the values
        /// of the parameters
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        public Operation<SequencePage<Order>> GetOrders(long pageIndex = 0, int pageSize = -1)
        {

        }

        public Operation ModifyOrder(Order order)
        {

        }

        public Operation FulfillOrder(Order order)
        {

        }

        public Operation<long> AddService(Service service)
        {

        }

        public Operation<long> AddServiceInterface(ServiceInterface @interface)
        {

        }

        public Operation<long> AddProduct(Product product)
        {

        }
        #endregion

        #region Customer
        public Operation<SequencePage<ISearchableItem>> FindItem(string searchString, string tags = null)
        {

        }
        public Operation<long> AddToBasket(long itemId, SearchableItemType type = SearchableItemType.Product)
        {

        }
        public Operation<long> AddToList(string listName, long itemId, SearchableItemType type = SearchableItemType.Product)
        {

        }

        public Operation RemoveFromBasket(long baskeItemId)
        {

        }
        public Operation RemoveFromList(string listName, long basketItemId)
        {

        }

        public Operation Pay(long[] basketItemIds)
        {

        }
        #endregion

        #region Configure
        #endregion
    }
}
