using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System.Collections.Generic;

namespace Gaia.Core.Services
{
    public interface IAdvertService : IGaiaService, IUserContextAware
    {
        [Feature("system/User/Advert/@create")]
        Operation<Advert> CreateAdvert();


        [Feature("system/User/Advert/@delete")]
        Operation<Advert> DeleteDraft(long advertId);

        [Feature("system/User/Advert/@update")]
        Operation<Advert> UpdateAdvert(Advert advert);

        [Feature("system/User/Advert/@review")]
        Operation<Advert> SubmitForReview(long advertId);

        [Feature("system/User/Advert/@publish")]
        Operation<Advert> Publish(long advertId);

        [Feature("system/User/Advert/@suspend")]
        Operation<Advert> Suspend(long advertId);

        [Feature("system/User/Advert/@archive")]
        Operation<Advert> Archive(long advertId);

        /// <summary>
        /// loads the next advert, given an array of ids of previously exposed advert.
        /// </summary>
        /// <param name="exposed"></param>
        /// <returns></returns>
        [Feature("system/Adverts/@next")]
        Operation<Advert> NextAdvert(long[] exposed);

        /// <summary>
        /// Increments the hit-count for the advert with the specified id for the current user by 1.
        /// </summary>
        /// <param name="advert"></param>
        /// <returns></returns>
        [Feature("system/Adverts/@hit")]
        Operation Hit(long advertId);
    }
}
