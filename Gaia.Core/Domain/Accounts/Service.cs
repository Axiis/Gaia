﻿using Axis.Pollux.Identity.Principal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.Accounts
{
    /// <summary>
    /// Note that the farm object serves as a context to attaching images and other kinds of resources i havent even thought of as of yet.
    /// Thus, i cannot add properties for those, it will be assumed that one would retrieve these via the appropriate services.
    /// </summary>
    public class Service : GaiaEntity<long>
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

        public ServiceCategory Category
        {
            get { return get<ServiceCategory>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// Navigation property that will contain references to all the business accounts for the current user that are
        /// associated with this Service
        /// </summary>
        public virtual ICollection<CorporateData> BusinessAccounts { get; set; }
    }

    public enum ServiceCategory
    {
        Other
    }
}