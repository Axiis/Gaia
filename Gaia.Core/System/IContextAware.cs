using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.System
{
    public interface IUserContextAware
    {
        IUserContextService UserContext { get; }
    }
}
