using Axis.Luna;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Axis.Luna.RandomAlphaNumericGenerator;

namespace Gaia.Core.Utils
{
    /// <summary>
    /// X00-00X0-XXX00
    /// where X - Alpha
    /// and   0 - numeric
    /// </summary>
    public static class IdGenerator
    {
        public static string NewId(string format, Random random = null)
        {
            var r = random ?? new Random(Guid.NewGuid().GetHashCode());
            return format.ToUpper()
                .Aggregate(new StringBuilder(), (acc, next) => acc.Append(next == 'X' ? Normalize(RandomAlpha(1, r).ToUpper()) : 
                                                                          next == '0' ? RandomNumeric(1, r) :
                                                                          next.ToString()))
                .ToString();
        }

        private static string Normalize(string alpha)
        {
            if (alpha == "S") return "R";
            else if (alpha == "O") return "G";
            else if (alpha == "I") return "B";
            else if (alpha == "L") return "H";
            else if (alpha == "Z") return "P";
            else return alpha;
        }
    }
}
