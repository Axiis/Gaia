using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public static class UserStatus
    {
        public static readonly int Unverified = 0;
        public static readonly int Active = 1;
        public static readonly int Inactive = 2;
        public static readonly int Suspended = 3;
        public static readonly int Archived = 4;
    }
}
