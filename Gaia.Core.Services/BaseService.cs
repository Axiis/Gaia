using Gaia.Core.System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Services
{
    public abstract class BaseService : IUserContextAware
    {
        public virtual IUserContextService UserContext { get; protected set; }
    }
}
