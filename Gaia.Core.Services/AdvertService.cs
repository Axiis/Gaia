using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;

namespace Gaia.Core.Services
{
    public class AdvertService : IAdvertService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }


        public AdvertService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<Advert> CreateAdvert()
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var advertstore = DataContext.Store<Advert>();
                var advert = advertstore.NewObject().With(new
                {
                    CreatedBy = user.UserId,
                    OwnerId = user.UserId,
                    Status = AdvertStatus.Draft
                });

                if (advertstore.Add(advert).Context.CommitChanges() > 0) return advert;
                else throw new Exception("could not create advert");
            });

        public Operation Hit(long advertId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var advert = DataContext.Store<Advert>().Query
                                        .FirstOrDefault(_advert => _advert.EntityId == advertId)
                                        .ThrowIfNull("could not find advert");

                var user = UserContext.CurrentUser;
                var ahstore = DataContext.Store<AdvertHit>();
                var hit = ahstore.Query.FirstOrDefault(ah => ah.AdvertId == advertId && ah.OwnerId == user.UserId) ??
                          ahstore.NewObject().With(new
                          {
                              AdvertId = advert.EntityId,
                              CreatedBy = user.UserId,
                              OwnerId = user.UserId
                          })
                          .UsingValue(ah => ahstore.Add(ah).Context.CommitChanges());
                hit.HitCount++;
                ahstore.Modify(hit, true);
            });

        /// <summary>
        /// Gets the next relevant advert. For now, i wont bother with the demographic thing,
        /// till i can figure out a way to work a DSL into the demographic filtering.
        /// For now, just get all the adverts one after the other.
        /// </summary>
        /// <param name="exposedIds"></param>
        /// <returns></returns>
        public Operation<Advert> NextAdvert(long[] exposedIds)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var advertStore = DataContext.Store<Advert>();
                var now = DateTime.Now;
                var allIds = advertStore.Query.Where(advert => advert.ExpiresOn <= now).Select(advert => advert.EntityId);
                var unexposed = allIds.ToArray().Except(exposedIds).ToArray();
                if (unexposed.Length == 0) return null;
                var nextId = unexposed[new Random(unexposed.GetHashCode()).Next(unexposed.Length)];
                return advertStore.Query.FirstOrDefault(advert => advert.EntityId == nextId);
            });

        public Operation<Advert> Publish(long advertId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var advertStore = DataContext.Store<Advert>();
                return advertStore.Query
                                  .Where(advert => advert.EntityId == advertId)
                                  .Where(advert => advert.Status == AdvertStatus.Review)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find advert")
                                  .UsingValue(advert =>
                                  {
                                      advert.Status = AdvertStatus.Published;
                                      advertStore.Modify(advert, true);
                                  });
            });

        public Operation<Advert> SubmitForReview(long advertId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var advertStore = DataContext.Store<Advert>();
                return advertStore.Query
                                  .Where(advert => advert.EntityId == advertId)
                                  .Where(advert => advert.Status == AdvertStatus.Draft)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find advert")
                                  .UsingValue(advert =>
                                  {
                                      advert.Status = AdvertStatus.Review;
                                      advertStore.Modify(advert, true);
                                  });
            });

        public Operation<Advert> Suspend(long advertId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var advertStore = DataContext.Store<Advert>();
                return advertStore.Query
                                  .Where(advert => advert.EntityId == advertId)
                                  .Where(advert => advert.Status == AdvertStatus.Published)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find advert")
                                  .UsingValue(advert =>
                                  {
                                      advert.Status = AdvertStatus.Suspended;
                                      advertStore.Modify(advert, true);
                                  });
            });

        public Operation<Advert> Archive(long advertId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var advertStore = DataContext.Store<Advert>();
                return advertStore.Query
                                  .Where(advert => advert.EntityId == advertId)
                                  .Where(advert => advert.Status == AdvertStatus.Published)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find advert")
                                  .UsingValue(advert =>
                                  {
                                      advert.Status = AdvertStatus.Archived;
                                      advertStore.Modify(advert, true);
                                  });
            });

        public Operation<Advert> UpdateAdvert(Advert advert)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var advertStore = DataContext.Store<Advert>();
                return advertStore.Query
                                  .Where(_advert => _advert.EntityId == advert.EntityId)
                                  .Where(_advert => user.UserId == _advert.OwnerId)
                                  .Where(_advert => _advert.Status == AdvertStatus.Draft)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find advert")
                                  .UsingValue(_advert =>
                                  {
                                      _advert.ExpiresOn = advert.ExpiresOn;
                                      _advert.MediaType = advert.MediaType;
                                      _advert.MediaURI = advert.MediaURI;

                                      advertStore.Modify(_advert, true);
                                  });
            });

        public Operation<Advert> DeleteDraft(long advertId)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var user = UserContext.CurrentUser;
                var advertStore = DataContext.Store<Advert>();
                return advertStore.Query
                                  .Where(_advert => _advert.EntityId == advertId)
                                  .Where(_advert => user.UserId == _advert.OwnerId)
                                  .Where(_advert => _advert.Status == AdvertStatus.Draft)
                                  .FirstOrDefault()
                                  .ThrowIfNull("could not find advert")
                                  .UsingValue(_advert => advertStore.Delete(_advert, true));
            });
    }
}
