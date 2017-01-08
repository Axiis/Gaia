using Axis.Luna.Extensions;
using Gaia.Core.Domain.MarketPlace;
using Gaia.Core.Services;
using Gaia.Server.Controllers.MarketPlaceModels;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Web.Http;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Gaia.Server.Utils.Extensions;

namespace Gaia.Server.Controllers
{
    public class MarketPlaceController : ApiController
    {
        private IMarketPlaceService _marketPlace = null;

        public MarketPlaceController(IMarketPlaceService marketplace)
        {
            ThrowNullArguments(() => marketplace);

            this._marketPlace = marketplace;
        }


        #region Merchant
        [HttpGet]
        [Route("api/market-place/merchants/product-categories")]
        public IHttpActionResult GetProductCategories()
            => _marketPlace.GetProductCategories().OperationResult(Request);


        [HttpGet]
        [Route("api/market-place/merchants/service-categories")]
        public IHttpActionResult GetServiceCategories()
            => _marketPlace.GetServiceCategories().OperationResult(Request);

        [HttpGet]
        [Route("api/market-place/merchant/products")]
        public IHttpActionResult FindMerchantProducts([FromBody]SearchArgs info)
            => _marketPlace.FindMerchantProducts(info.SearchString, info.PageSize, info.PageIndex)
                .OperationResult(Request);

        [HttpGet]
        [Route("api/market-place/merchant/services")]
        public IHttpActionResult FindMerchantServices(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<SearchArgs>(_json))
                .Pipe(info => _marketPlace.FindMerchantServices(info.SearchString, info.PageSize, info.PageIndex))
                .Pipe(_op => _op.OperationResult(Request));


        [HttpGet]
        [Route("api/market-place/merchants/orders")]
        public IHttpActionResult GetMerchantOrders(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<SearchArgs>(_json))
                .Pipe(info => _marketPlace.GetMerchantOrders(info.PageIndex, info.PageSize))
                .Pipe(_op => _op.OperationResult(Request));

        [HttpPut]
        [Route("api/market-place/merchants/orders")]
        public IHttpActionResult ModifyOrder([FromBody] Order order)
            => _marketPlace.ModifyOrder(order).OperationResult(Request);


        [HttpPut]
        [Route("api/market-place/merchants/orders/fulfilled")]
        public IHttpActionResult FulfillOrder([FromBody]Order order)
            => _marketPlace.FulfillOrder(order).OperationResult(Request);


        [HttpPost]
        [Route("api/market-place/merchants/services")]
        public IHttpActionResult AddService([FromBody]Service service)
            => _marketPlace.AddService(service).OperationResult(Request);


        [HttpPut]
        [Route("api/market-place/merchants/services")]
        public IHttpActionResult ModifyService([FromBody]Service service)
            => _marketPlace.ModifyService(service).OperationResult(Request);


        [HttpPost]
        [Route("api/market-place/merchants/service-interfaces")]
        public IHttpActionResult AddServiceInterface([FromBody]ServiceInterface @interface)
            => _marketPlace.AddServiceInterface(@interface).OperationResult(Request);


        [HttpPost]
        [Route("api/market-place/merchants/products")]
        public IHttpActionResult AddProduct([FromBody]Product product)
            => _marketPlace.AddProduct(product).OperationResult(Request);


        [HttpPut]
        [Route("api/market-place/merchants/products")]
        public IHttpActionResult ModifyProduct([FromBody]Product product)
            => _marketPlace.ModifyProduct(product).OperationResult(Request);

        #endregion

        #region Customer
        [HttpGet]
        [Route("api/market-place/customer/products")]
        public IHttpActionResult FindCustomerProduct(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<SearchArgs>(_json))
                .Pipe(info => _marketPlace.FindCustomerProducts(info.SearchString, info.PageSize, info.PageIndex))
                .Pipe(_op => _op.OperationResult(Request));

        [HttpGet]
        [Route("api/market-place/customer/services")]
        public IHttpActionResult FindCustomerService(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<SearchArgs>(_json))
                .Pipe(info => _marketPlace.FindCustomerServices(info.SearchString, info.PageSize, info.PageIndex))
                .Pipe(_op => _op.OperationResult(Request));

        [HttpGet]
        [Route("api/market-place/customer/shopping-lists")]
        IHttpActionResult GetShoppingLists()
            => _marketPlace.GetShoppingLists().OperationResult(Request);


        [HttpPut]
        [Route("api/market-place/customer/cart")]
        IHttpActionResult AddToBasket(AddToListArgs args)
            => _marketPlace.AddToBasket(args?.ItemId ?? -1, args?.ItemType ?? ItemType.Product)
                .OperationResult(Request);


        [HttpDelete]
        [Route("api/market-place/customer/cart")]
        IHttpActionResult RemoveFromBasket(RemoveFromListArgs arg)
            => _marketPlace.RemoveFromBasket(arg?.ItemId ?? -1).OperationResult(Request);


        [HttpPut]
        [Route("api/market-place/customer/list")]
        IHttpActionResult AddToList(AddToListArgs args)
            => _marketPlace.AddToList(args?.ListName, args?.ItemId ?? -1, args?.ItemType ?? ItemType.Product)
                .OperationResult(Request);


        [HttpDelete]
        [Route("api/market-place/customer/list")]
        IHttpActionResult RemoveFromList(RemoveFromListArgs arg)
            => _marketPlace.RemoveFromList(arg?.ListName, arg?.ItemId ?? -1).OperationResult(Request);


        [HttpPost]
        [Route("api/market-place/customer/cart/checkout")]
        IHttpActionResult Checkout() => _marketPlace.Checkout().OperationResult(Request);



        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current customer. By default, this method will return the entire list of orders.
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/market-place/customer/orders")]
        IHttpActionResult GetCustomerOrders(string data)
            => Encoding.UTF8.GetString(Convert.FromBase64String(data))
                .Pipe(_json => JsonConvert.DeserializeObject<SearchArgs>(_json))
                .Pipe(info => _marketPlace.GetCustomerOrders(info?.PageIndex ?? 0, info?.PageSize ?? -1))
                .Pipe(_op => _op.OperationResult(Request));

        #endregion

        #region Configure
        #endregion
    }

    namespace MarketPlaceModels
    {
        public class SearchArgs
        {
            public string SearchString { get; set; }
            public int PageSize { get; set; } = -1;
            public long PageIndex { get; set; } = 0;
        }

        public class AddToListArgs
        {
            public string ListName { get; set; }
            public long ItemId { get; set; }
            public ItemType ItemType { get; set; }
        }

        public class RemoveFromListArgs
        {
            public string ListName { get; set; }
            public long ItemId { get; set; }
        }



        public class CheckoutArgs
        {
        }
    }
}
