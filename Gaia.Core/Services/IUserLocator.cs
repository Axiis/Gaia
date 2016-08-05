using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Services
{
    public interface IUserLocator
    {
        /// <summary>
        /// retrieves andreturns the name of the currently authenticated user in the execution context (or request context)
        /// </summary>
        string CurrentUser { get; set; }
    }
}
