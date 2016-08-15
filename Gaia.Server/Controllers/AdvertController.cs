using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Gaia.Core.Services;
using System.Web.Http;
using Gaia.Core.Domain;
using System;
using System.Linq;
using Axis.Luna;

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
        public IHttpActionResult CreateAdvert()
            => _advert.CreateAdvert()
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpDelete]
        [Route("api/adverts/drafts")]
        public IHttpActionResult DeleteDraft(long advertId)
            => _advert.DeleteDraft(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpPut]
        [Route("api/adverts")]
        public IHttpActionResult UpdateAdvert([FromBody]Advert advert)
            => _advert.UpdateAdvert(advert)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/adverts/reviews/@{advertId}")]
        public IHttpActionResult SubmitForReview(long advertId)
            => _advert.SubmitForReview(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/adverts/published/@{advertId}")]
        public IHttpActionResult Publish(long advertId)
            => _advert.Publish(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/adverts/suspended/@{advertId}")]
        public IHttpActionResult Suspend(long advertId)
            => _advert.Suspend(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;

        [HttpPut]
        [Route("api/adverts/archived/@{advertId}")]
        public IHttpActionResult Archive(long advertId)
            => _advert.Archive(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        /// <summary>
        /// Retrieves the next advert after examining the query-string for a parameter "exposed" that contains a comma separated list of advert ids
        /// e.g
        /// <para>
        /// <c>api/adverts/sequence?exposed=2212,4432,543,5,134,654,24,654,755,12234,675</c>
        /// </para>
        /// </summary>
        /// <param name="exposed"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/adverts/sequence")]
        public IHttpActionResult NextAdvert(string exposed)
            => Operation.Try(() => exposed.Split(',').Select(v => long.Parse(v)).ToArray())
                  .Then(opr => _advert.NextAdvert(opr.Result))
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;


        [HttpPost]
        [Route("api/adverts/hits/@{advertId}")]
        public IHttpActionResult Hit(long advertId)
            => _advert.Hit(advertId)
                  .Then(opr => this.Ok(opr.Result).As<IHttpActionResult>())
                  .Instead(opr => this.InternalServerError(opr.GetException()))
                  .Result;
        
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
