using System.Collections.Generic;
using System.Linq;
using Axis.Luna;
using Gaia.Core.Domain.Accounts;
using Axis.Jupiter;

using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.ExceptionExtensions;
using Gaia.Core.Utils;
using Axis.Luna.Extensions;

namespace Gaia.Core.Services
{
    public class UserAccountsService : IUserAccountsService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }


        public UserAccountsService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext,
                               () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }


        #region Farm Accounts
        public Operation<long> AddFarmAccount(Farm data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the biodata

                //persist the contact data
                DataContext.Store<Farm>()
                    .Add(data).Context
                    .CommitChanges();

                return data.EntityId;
            });

        public Operation ModifyFarmAccount(Farm data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                var store = DataContext.Store<Farm>();

                var persisted = store.Query
                    .Where(_ud => _ud.OwnerId == _user.EntityId)
                    .Where(_ud => _ud.EntityId == data.EntityId)
                    .FirstOrDefault()
                    .ThrowIfNull("data not found");

                data.CopyTo(persisted);
                store.Modify(persisted, true);
            });

        public Operation<IEnumerable<Farm>> GetFarmAccounts()
            => FeatureAccess.Guard(UserContext, () => DataContext.Store<Farm>().Query.Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId).AsEnumerable());

        public Operation RemoveFarmAccount(long[] ids)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var contactStore = DataContext.Store<Farm>();
                ids.Batch(200).ForAll((cnt, _batch) =>
                {
                    var nar = _batch.ToArray();
                    contactStore.Query
                                .Where(_ => _.OwnerId == user.EntityId)
                                .Where(_ => nar.Contains(_.EntityId))
                                .Pipe(_ => contactStore.Delete(_.AsEnumerable()));
                });

                contactStore.Context.CommitChanges();
            });
        #endregion

        #region Service Accounts
        public Operation<long> AddServiceAccount(Service data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                data.OwnerId = _user.UserId;

                //validate the biodata

                //persist the contact data
                DataContext.Store<Service>()
                    .Add(data).Context
                    .CommitChanges();

                return data.EntityId;
            });

        public Operation ModifyServiceAccount(Service data)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var _user = UserContext.CurrentUser;
                var store = DataContext.Store<Service>();

                var persisted = store.Query
                    .Where(_ud => _ud.OwnerId == _user.EntityId)
                    .Where(_ud => _ud.EntityId == data.EntityId)
                    .FirstOrDefault()
                    .ThrowIfNull("data not found");

                data.CopyTo(persisted);
                store.Modify(persisted, true);
            });

        public Operation<IEnumerable<Service>> GetServiceAccounts()
            => FeatureAccess.Guard(UserContext, () =>
            {
                var services = DataContext.Store<Service>().Query.Where(_ud => _ud.OwnerId == UserContext.CurrentUser.EntityId).ToArray();
                return services.AsEnumerable();
            });

        public Operation RemoveServiceAccount(long[] ids)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var contactStore = DataContext.Store<Service>();
                ids.Batch(200).ForAll((cnt, _batch) =>
                {
                    var nar = _batch.ToArray();
                    contactStore.Query
                                .Where(_ => _.OwnerId == user.EntityId)
                                .Where(_ => nar.Contains(_.EntityId))
                                .Pipe(_ => contactStore.Delete(_.AsEnumerable()));
                });

                contactStore.Context.CommitChanges();
            });
        #endregion
    }
}
