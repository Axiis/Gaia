using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class Advert: GaiaEntity<long>
    {
        public virtual string OwnerId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public virtual User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// Media uri is a string identifying where the media is located. It does not have to be a url. it may identify a media in the local db,
        /// on a web api/service, local directory, etc.
        /// </summary>
        public virtual string MediaURI
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public virtual AdvertMediaType MediaType
        {
            get { return get<AdvertMediaType>(); }
            set { set(ref value); }
        }

        public DateTime ExpiresOn
        {
            get { return get<DateTime>(); }
            set { set(ref value); }
        }
        public bool IsExpired => DateTime.Now > ExpiresOn;

        /// <summary>
        /// Json array of objects defining the demographic
        /// </summary>
        public string TargetDemographic
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public AdvertStatus Status
        {
            get { return get<AdvertStatus>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// bracked '[]' delimited, comma separated list of services this advert is relevant for.
        /// </summary>
        public string ServiceTags
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public IEnumerable<string> Services  
            => ServiceTags?.Split(',')
                           .Select(part => part.Trim(new[] { '[',']',' ' })) ?? new string[0];


        public Advert()
        {
            Status = AdvertStatus.Draft;
        }
    }

    public enum AdvertStatus
    {
        Draft,
        Review,
        Published,
        Archived,
        Suspended
    }

    public enum AdvertMediaType
    {
        Video,

        Image
    }
}
