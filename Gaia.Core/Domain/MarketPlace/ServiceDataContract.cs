using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class ServiceDataContract : GaiaEntity<long>
    {
        public string Name
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public string DDL
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
    }
}
