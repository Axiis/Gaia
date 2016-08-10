using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Gaia.Core.Services;
using System.Web.Http;
using Gaia.Core.Domain;
using System;

namespace Gaia.Server.Controllers
{
    public class AdvertController : ApiController
    {
        private IAdvertService _advert = null;

        public AdvertController(IAdvertService advertService)
        {
            ThrowNullArguments(() => advertService);

            this._advert = advertService;
        }

        [HttpPost]
        [Route("api/adverts")]
        IHttpActionResult CreateAdvert()
            => _advert.CreateAdvert()
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpDelete]
        [Route("api/adverts/drafts")]
        IHttpActionResult DeleteDraft(long advertId)
            => _advert.DeleteDraft(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpPut]
        [Route("api/adverts")]
        IHttpActionResult UpdateAdvert([FromBody]Advert advert)
            => _advert.UpdateAdvert(advert)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/adverts/reviews/@{advertId}")]
        IHttpActionResult SubmitForReview(long advertId)
            => _advert.SubmitForReview(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPost]
        [Route("api/adverts/published")]
        IHttpActionResult Publish(long advertId);

        [Route("system/User/Advert/@suspend")]
        Operation<Advert> Suspend(long advertId);

        [Route("system/User/Advert/@archive")]
        Operation<Advert> Archive(long advertId);
        
        [Route("system/Adverts/@next")]
        Operation<Advert> NextAdvert(long[] exposed);
        
        [Route("system/Adverts/@hit")]
        Operation Hit(long advertId);

        Nullable<>
    }

    namespace AdvertModels
    {
        public class Advert
        {
            public long Id { get; set; }
            public string Owner { get; set; }
            
            public virtual string MediaURI { get; set; }
            public virtual AdvertMediaType MediaType { get; set; }

            public DateTime? ExpiryDate { get; set; }

            /// <summary>
            /// Json array of objects defining the demographic
            /// </summary>
            public string TargetDemographic { get; set; }

            public AdvertStatus Status { get; set; }

            /// <summary>
            /// bracked '[]' delimited, comma separated list of services this advert is relevant for.
            /// </summary>
            public string ServiceTags { get; set; }

            public Core.Domain.Advert ToDomainAdvert() => new Core.Domain.Advert
            {
                EntityId = Id,
                ExpiryDate = ExpiryDate.ThrowIfNull("invalid expiration date").Value,
                MediaType = MediaType,
                MediaURI = MediaURI,
                OwnerId = Owner,
                ServiceTags = ServiceTags,
                Status = Status, 
                TargetDemographic = TargetDemographic
            };
        }
    }
}
