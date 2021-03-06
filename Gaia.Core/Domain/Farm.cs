﻿using Axis.Pollux.Identity.Principal;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using static Axis.Luna.Extensions.ObjectExtensions;

namespace Gaia.Core.Domain
{

    public class Farm: GaiaEntity<long>
    {
        public string OwnerId
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public virtual User Owner
        {
            get { return get<User>(); }
            set { set(ref value); }
        }

        public string Description
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public FarmType FarmType
        {
            get { return get<FarmType>(); }
            set { set(ref value); }
        }

        public string GeoData
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// Navigation property that will contain references to all the business accounts for the current user that are
        /// associated with this Farm
        /// </summary>
        public virtual ICollection<CorporateData> BusinessAccounts { get; set; }


        public GeoArea GeoArea() => Eval(() => GeoData.ToGeoArea());
    }

    public enum FarmType
    {
        Other,
        Crop,
        Livestock,
        Mixed
    }
}
