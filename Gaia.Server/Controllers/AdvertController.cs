using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.OperationExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;

using Gaia.Core.Services;
using System.Web.Http;
using System;
using System.Linq;
using Axis.Luna;
using Gaia.Server.Controllers.AdvertModels;

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
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpDelete]
        [Route("api/adverts/drafts")]
        public IHttpActionResult DeleteDraft(long advertId)
            => _advert.DeleteDraft(advertId)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpPut]
        [Route("api/adverts")]
        public IHttpActionResult UpdateAdvert([FromBody]AdvertInfo advert)
            => _advert.UpdateAdvert(advert.ToDomainAdvert())
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/adverts/reviews")]
        public IHttpActionResult SubmitForReview([FromBody]AdvertInfo advert)
            => _advert.SubmitForReview(advert.Id)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/adverts/published")]
        public IHttpActionResult Publish([FromBody]AdvertInfo advert)
            => _advert.Publish(advert.Id)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/adverts/suspended")]
        public IHttpActionResult Suspend([FromBody]AdvertInfo advert)
            => _advert.Suspend(advert.Id)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;

        [HttpPut]
        [Route("api/adverts/archived")]
        public IHttpActionResult Archive([FromBody]AdvertInfo advert)
            => _advert.Archive(advert.Id)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
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
        public IHttpActionResult NextAdvert([FromBody]AdvertViewInfo info)
            => Operation.Try(() => info.Exposed.Split(',').Select(v => long.Parse(v)).ToArray())
                  .Then(opr => _advert.NextAdvert(opr.Result))
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;


        [HttpPost]
        [Route("api/adverts/hits")]
        public IHttpActionResult Hit([FromBody]AdvertInfo advert)
            => _advert.Hit(advert.Id)
                  .Then(opr => this.Ok(opr).As<IHttpActionResult>())
                  .Instead(opr => this.Content(System.Net.HttpStatusCode.InternalServerError, opr))
                  .Result;
        
    }

    namespace AdvertModels
    {
        public class AdvertViewInfo
        {
            /// <summary>
            /// A comma separated list of advert ids
            /// </summary>
            public string Exposed { get; set; }
        }

        public class AdvertInfo
        {
            public long Id { get; set; }
            public string Owner { get; set; }
            
            public  string MediaURI { get; set; }
            public Core.Domain.AdvertMediaType MediaType { get; set; }

            public DateTime? ExpiryDate { get; set; }

            /// <summary>
            /// Json array of objects defining the demographic
            /// </summary>
            public string TargetDemographic { get; set; }

            public Core.Domain.AdvertStatus Status { get; set; }

            /// <summary>
            /// bracked '[]' delimited, comma separated list of services this advert is relevant for.
            /// </summary>
            public string ServiceTags { get; set; }

            public Core.Domain.Advert ToDomainAdvert() => new Core.Domain.Advert
            {
                EntityId = Id,
                ExpiresOn = ExpiryDate.ThrowIfNull("invalid expiration date").Value,
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
