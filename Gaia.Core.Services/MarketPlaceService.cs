﻿using Axis.Jupiter;
using Axis.Luna;
using Gaia.Core.Domain.MarketPlace;
using Gaia.Core.Domain.Meta;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

namespace Gaia.Core.Services
{
    public class MarketPlaceService: IMarketPlaceService
    {

        public IUserContextService UserContext { get; private set; }

        public IDataContext DataContext { get; private set; }


        public MarketPlaceService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }


        #region Merchant
        public Operation<IEnumerable<ProductCategory>> GetProductCategories()
            => FeatureAccess.Guard(UserContext, () => DataContext.Store<ProductCategory>().Query.AsEnumerable());

        public Operation<IEnumerable<ServiceCategory>> GetServiceCategories()
            => FeatureAccess.Guard(UserContext, () => DataContext.Store<ServiceCategory>().Query.AsEnumerable());

        public Operation<SequencePage<ISearchableItem>> FindMerchantProducts(string searchString, int pageSize, long pageIndex = 0L)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    var searchTokens = (searchString ?? "").Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(_st => _st.Replace('+', ' '))
                        .ToArray();

                    return DataContext.Store<Product>().QueryWith(_p => _p.Owner)
                        .Where(_p => _p.Owner.EntityId == UserContext.CurrentUser.EntityId)
                        .Where(SearchableExpression<Product>(searchTokens))
                        .OrderBy(_p => _p.EntityId)
                        .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
                }
                else return DataContext.Store<Product>().QueryWith(_p => _p.Owner)
                    .Where(_p => _p.Owner.EntityId == UserContext.CurrentUser.EntityId)
                    .OrderBy(_p => _p.EntityId)
                    .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
            });
        public Operation<SequencePage<ISearchableItem>> FindMerchantServices(string searchString, int pageSize, long pageIndex = 0L)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    var searchTokens = (searchString ?? "").Split(new char[]{' '}, StringSplitOptions.RemoveEmptyEntries)
                        .Select(_st => _st.Replace('+', ' '))
                        .ToArray();

                    return DataContext.Store<Service>().QueryWith(_s => _s.Owner)
                        .Where(_p => _p.Owner.EntityId == UserContext.CurrentUser.EntityId)
                        .Where(SearchableExpression<Service>(searchTokens))
                        .OrderBy(_p => _p.EntityId)
                        .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
                }
                else return DataContext.Store<Service>().QueryWith(_s => _s.Owner)
                    .Where(_s => _s.Owner.EntityId == UserContext.CurrentUser.EntityId)
                    .OrderBy(_p => _p.EntityId)
                    .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
            });

        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current user. By default, this method will return the entire list of orders. Varying the values
        /// of the parameters
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        public Operation<SequencePage<Order>> GetMerchantOrders(long pageIndex = 0, int pageSize = -1)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var orderStore = DataContext.Store<Order>();
                var q = orderStore.QueryWith(_o => _o.Merchant)
                    .Where(_o => _o.Merchant.EntityId == UserContext.CurrentUser.EntityId)
                    .OrderBy(_o => _o.CreatedOn);
                    
                var arr = q.Skip((int)pageIndex * pageSize)
                           .Take(pageSize)
                           .ToArray();
                return new SequencePage<Order>(arr, q.Count(), pageIndex, pageSize);
            });

        public Operation ModifyOrder(Order order)
            => FeatureAccess.Guard(UserContext, () =>
            {
                order.ModifiedBy = UserContext.CurrentUser.EntityId;
                DataContext.Store<Order>().Modify(order, true);
            });

        public Operation FulfillOrder(Order order)
            => FeatureAccess.Guard(UserContext, () =>
            {
                order.ModifiedBy = UserContext.CurrentUser.EntityId;
                order.Status = OrderStatus.OrderFulfilled;
                DataContext.Store<Order>().Modify(order, true);
            });

        public Operation<long> AddService(Service service)
            => FeatureAccess.Guard(UserContext, () =>
            {
                service.Owner = UserContext.CurrentUser;
                service.CreatedBy = UserContext.CurrentUser.UserId;

                DataContext.Store<Service>().Add(service).Context.CommitChanges();
                return service.EntityId;
            });

        public Operation ModifyService(Service service)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (service.CreatedBy != UserContext.CurrentUser.UserId) throw new Exception("Cannot modify service belonging to another user");

                service.ModifiedBy = UserContext.CurrentUser.EntityId;
                DataContext.Store<Service>().Modify(service, true);
            });

        public Operation<long> AddServiceInterface(ServiceInterface @interface)
            => FeatureAccess.Guard(UserContext, () =>
            {
                @interface.CreatedBy = UserContext.CurrentUser.UserId;

                DataContext.Store<ServiceInterface>().Add(@interface).Context.CommitChanges();
                return @interface.EntityId;
            });

        public Operation<long> AddProduct(Product product)
            => FeatureAccess.Guard(UserContext, () =>
            {
                product.CreatedBy = UserContext.CurrentUser.UserId;
                product.Owner = UserContext.CurrentUser;

                DataContext.Store<Product>().Add(product).Context.CommitChanges();
                return product.EntityId;
            });

        public Operation ModifyProduct(Product product)
            => FeatureAccess.Guard(UserContext, () =>
            {
                product.ModifiedBy = UserContext.CurrentUser.EntityId;
                DataContext.Store<Product>().Modify(product, true);
            });
        #endregion

        #region Customer
        public Operation<SequencePage<ISearchableItem>> FindCustomerProducts(string searchString, int pageSize, long pageIndex = 0L)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    var searchTokens = (searchString ?? "").Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(_st => _st.Replace('+', ' '))
                        .ToArray();

                    return DataContext.Store<Product>().Query
                        .Where(_p => _p.Status == ProductStatus.Published)
                        .Where(SearchableExpression<Product>(searchTokens))
                        .OrderBy(_p => _p.EntityId)
                        .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
                }
                else return DataContext.Store<Product>().Query
                    .Where(_p => _p.Status == ProductStatus.Published)
                    .OrderBy(_p => _p.EntityId)
                    .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
            });
        public Operation<SequencePage<ISearchableItem>> FindCustomerServices(string searchString, int pageSize, long pageIndex = 0L)
            => FeatureAccess.Guard(UserContext, () =>
            {
                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    var searchTokens = (searchString ?? "").Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(_st => _st.Replace('+', ' '))
                        .ToArray();

                    return DataContext.Store<Service>().Query
                        .Where(_s => _s.Status == ServiceStatus.Available)
                        .Where(SearchableExpression<Service>(searchTokens))
                        .OrderBy(_p => _p.EntityId)
                        .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
                }
                else return DataContext.Store<Service>().Query
                    .Where(_s => _s.Status == ServiceStatus.Available)
                    .OrderBy(_p => _p.EntityId)
                    .Pipe(_p => new SequencePage<ISearchableItem>(_p.Skip((int)(pageSize * pageIndex)).Take(pageSize).ToArray(), _p.Count(), pageSize, pageIndex));
            });

        public Operation<IEnumerable<string>> GetShoppingLists()
            => FeatureAccess.Guard(UserContext, () =>
            {
                return DataContext.Store<ShoppingListItem>()
                    .QueryWith(_li => _li.Owner)
                    .Where(_li => _li.Owner.EntityId == UserContext.CurrentUser.UserId)
                    .Select(_li => _li.ListName)
                    .Distinct()
                    .AsEnumerable();
            });

        public Operation<long> AddToBasket(long itemId, ItemType type = ItemType.Product)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var cartStore = DataContext.Store<ShoppingCartItem>();
                var cartItem = cartStore.NewObject();
                cartItem.ItemType = type;
                cartItem.ItemId = itemId;
                cartItem.Owner = UserContext.CurrentUser;

                cartStore.Add(cartItem);

                return cartItem.EntityId;
            });

        public Operation<long> AddToList(string listName, long itemId, ItemType type = ItemType.Product)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var listStore = DataContext.Store<ShoppingListItem>();
                var listItem = listStore.NewObject();
                listItem.ItemType = type;
                listItem.ItemId = itemId;
                listItem.ListName = listName;
                listItem.Owner = UserContext.CurrentUser;

                listStore.Add(listItem);

                return listItem.EntityId;
            });


        public Operation RemoveFromBasket(long cartItemId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var cartStore = DataContext.Store<ShoppingCartItem>();
                var cartItem = cartStore.Query
                    .FirstOrDefault(_ci => _ci.EntityId == cartItemId)
                    .ThrowIfNull("could not find the item specified");
                cartStore.Delete(cartItem);
            });

        public Operation RemoveFromList(string listName, long listItemId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var listStore = DataContext.Store<ShoppingListItem>();
                var listItem = listStore.Query
                    .FirstOrDefault(_ci => _ci.EntityId == listItemId && _ci.ListName == listName)
                    .ThrowIfNull("could not find the item specified");
                listStore.Delete(listItem);
            });


        public Operation Checkout()
            => FeatureAccess.Guard(UserContext, () =>
            {
                //validate the order-aggregates
            });


        /// <summary>
        /// Retrieves a paginated slice of the Orders for the current customer. By default, this method will return the entire list of orders. Varying the values
        /// of the parameters
        /// </summary>
        /// <param name="pageIndex">the index of the page requested</param>
        /// <param name="pageSize">the number of elements per page</param>
        /// <returns></returns>
        public Operation<SequencePage<Order>> GetCustomerOrders(long pageIndex = 0, int pageSize = -1)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var orderStore = DataContext.Store<Order>();
                var q = orderStore.QueryWith(_o => _o.Customer)
                    .Where(_o => _o.Customer.EntityId == UserContext.CurrentUser.EntityId)
                    .OrderBy(_o => _o.CreatedOn);

                var arr = q.Skip((int)pageIndex * pageSize)
                           .Take(pageSize)
                           .ToArray();
                return new SequencePage<Order>(arr, q.Count(), pageIndex, pageSize);
            });
        #endregion

        #region Configure
        #endregion


        #region Util
        private Expression<Func<Searchable, bool>> SearchableExpression<Searchable>(string[] tokens)
        where Searchable: ISearchableItem
        {
            Expression exp = null;
            var param = Expression.Parameter(typeof(Searchable), "item");
            var props = new string[] { nameof(ISearchableItem.Description), nameof(ISearchableItem.Title), nameof(ISearchableItem.Tags) };
            foreach (var t in tokens)
            {
                foreach (var p in props)
                {
                    var propAccess = Expression.PropertyOrField(param, p);
                    var callExp = Expression.Call(propAccess, typeof(string).GetMethod("Contains"), Expression.Constant(t));
                    if (exp == null) exp = callExp;
                    else exp = Expression.OrElse(exp, callExp);
                }
            }

            var lambda = Expression.Lambda(exp, param);
            return (Expression<Func<Searchable, bool>>)lambda;
        }
        #endregion
    }
}
