using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;

namespace Gaia.Core.Services
{
    public class UserContext : IUserContextService
    {
        public User CurrentUser
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public IEnumerable<FeatureAccessProfile> UserAccessProfiles()
        {
            throw new NotImplementedException();
        }
    }
}
