using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public class ServiceInterface: GaiaEntity<long>
    {
        public string Name
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public ServiceDataContract DataContract
        {
            get { return get<ServiceDataContract>(); }
            set { set(ref value); }
        }
    }
}
