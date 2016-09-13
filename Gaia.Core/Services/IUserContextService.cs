using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Services
{
    public interface IUserContextService : IGaiaService
    {
        User CurrentUser { get; }

        /// <summary>
        /// Returns feature access profiles belonging to active (not expired) user subscriptions.
        /// </summary>
        /// <returns></returns>
        IEnumerable<FeatureAccessProfile> UserAccessProfiles();
    }
}
